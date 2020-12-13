"""views for user"""
import json
from operator import itemgetter
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseForbidden, HttpResponseNotFound, HttpResponseNotAllowed, JsonResponse
from django.contrib.auth import get_user_model, authenticate, login, logout
from django.contrib.auth.hashers import check_password
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import ensure_csrf_cookie
from django.core.cache import cache
from django.db import transaction
from rest_framework.decorators import api_view

from ingredient.models import Ingredient
from utils.auth import login_required_401
from utils.aws_utils import upload_profile_image
from .models import Fridge, FridgeIngredient, Region, Notification

User = get_user_model()


def get_region(region):
    """ get specific user Region Information """
    if region:
        return {
            "id": region.id,
            "name": region.name,
            "location": {
                "latitude": region.latitude,
                "longitude": region.longitude,
            }
        }


def get_region_list():
    """ get region list """
    return [get_region(region) for region in Region.objects.all()]


@ensure_csrf_cookie
@api_view(['GET'])
def get_region_info(request):
    """ get region list information for searching Region """
    try:
        """ get region list from seoul's center('종로', id:44) """
        region_list = get_region_list()
    except Region.DoesNotExist:
        return HttpResponseBadRequest()
    return JsonResponse(region_list, safe=False)


@ensure_csrf_cookie
@api_view(['POST'])
@transaction.atomic
def signup(request):
    """signup"""
    if request.method == 'POST':
        try:
            name, username, password, date_of_birth, email, region, region_range = itemgetter(
                'name', 'username', 'password', 'dateOfBirth', 'email', 'region', 'regionRange')(request.data)
            gu_name, dong_name = region['name'].split()
            user_region = Region.objects.get(
                gu_name=gu_name, dong_name=dong_name)
        except (KeyError, json.decoder.JSONDecodeError):
            return HttpResponseBadRequest()
        except Region.DoesNotExist:
            return HttpResponseNotFound()

        user = User.objects.create_user(
            username=username,
            password=password,
            email=email,
            name=name,
            date_of_birth=date_of_birth,
            region=user_region,
            region_range=region_range,
        )
        user.save()
        my_fridge = Fridge(user=user)
        my_fridge.save()
        checked_user = authenticate(
            request, username=username, password=password)
        login(request, checked_user)
        return JsonResponse(data={
            'id': checked_user.id,
            'username': checked_user.username,
            'email': checked_user.email,
            'name': checked_user.name,
            'dateOfBirth': checked_user.date_of_birth,
            'naengpaScore': checked_user.naengpa_score,
            'region': get_region(checked_user.region),
            'regionRange': user.region_range,
            'totalNotifications': 0,
        }, status=201)


@ensure_csrf_cookie
@api_view(['POST', 'PUT'])
def signin(request):
    """signin"""
    if request.method == 'POST':
        try:
            username = request.data['username']
            password = request.data['password']
        except (KeyError, json.decoder.JSONDecodeError):
            return HttpResponseBadRequest()
        if not User.objects.filter(username=username).count():
            return HttpResponseNotFound()

        user = authenticate(
            request, username=username, password=password)
        if user is not None:
            login(request, user)

            return JsonResponse(data={
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'name': user.name,
                'dateOfBirth': user.date_of_birth,
                'naengpaScore': user.naengpa_score,
                'region': get_region(user.region),
                'regionRange': user.region_range,
                'profileImage': user.profile_image,
                'totalNotifications': user.total_notifications,
            }, status=200)
        else:
            return HttpResponse(status=401)
    elif request.method == 'PUT':
        """check if username already exists"""
        try:
            username = request.data['username']
        except (KeyError, json.decoder.JSONDecodeError):
            return HttpResponseBadRequest()
        return JsonResponse({
            "isDuplicate": True if User.objects.filter(
                username=username).exists() else False,
        })


@ensure_csrf_cookie
@api_view(['GET'])
def signout(request):
    """signout"""
    if request.method == 'GET':
        logout(request)
        return HttpResponse(status=204)


@ensure_csrf_cookie
@api_view(['GET', 'PUT'])
@login_required_401
def user(request, id):
    """user"""
    # GET USER
    if request.method == 'GET':
        user = get_object_or_404(User, pk=id)
        current_user = {
            "id": user.id,
            "username": user.username,
            "name": user.name,
            "email": user.email,
            "dateOfBirth": user.date_of_birth,
            'naengpaScore': user.naengpa_score,
            "region": get_region(user.region),
            "regionRange": user.region_range,
            'profileImage': user.profile_image,
            'notifications': [{
                'id': item.id,
                'content': item.content,
                'createdAt': item.created_string,
                'deleted': item.deleted,
            } for item in user.notifications.all().order_by('-id')],
            'totalNotifications': user.total_notifications,
        }
        return JsonResponse(data=current_user, safe=False)
    elif request.method == 'PUT':
        if request.user.id != id:
            return HttpResponseForbidden()
        user = get_object_or_404(User, pk=id)
        try:
            req_data = json.loads(request.POST.get('user'))
            edit_name, edit_date_of_birth, edit_email, password_to_check = itemgetter(
                'name', 'dateOfBirth', 'email', 'password')(req_data)

            profile_image = request.FILES.getlist('image')
            if profile_image:
                uploaded_path = upload_profile_image(profile_image[0], id)
                user.profile_image = uploaded_path

        except (KeyError, json.decoder.JSONDecodeError) as e:
            return HttpResponseBadRequest()
        if check_password(password_to_check, request.user.password):
            user.name = edit_name
            user.date_of_birth = edit_date_of_birth
            user.email = edit_email
        else:
            return HttpResponse(status=401)
        user.save()
        return JsonResponse(data={
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'name': user.name,
            'dateOfBirth': user.date_of_birth,
            'naengpaScore': user.naengpa_score,
            'region': get_region(user.region),
            'regionRange': user.region_range,
            'profileImage': user.profile_image,
            'totalNotifications': user.notifications.filter(deleted=False).count(),
        }, status=201)


@ensure_csrf_cookie
@api_view(['PUT'])
@login_required_401
def change_password(request, id):
    # CHANGE PASSWORD
    if request.method == 'PUT':
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return HttpResponseNotFound()
        req_data = json.loads(request.body.decode())
        current_password = req_data['currentPassword']
        new_password = req_data['newPassword']
        if check_password(current_password, request.user.password):
            user.set_password(new_password)
            user.save()
        else:
            return HttpResponse(status=401)
        # user.save()
        return JsonResponse(data={
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'name': user.name,
            'dateOfBirth': user.date_of_birth,
            'naengpaScore': user.naengpa_score,
            'region': get_region(user.region),
            'regionRange': user.region_range,
            'profileImage': user.profile_image,
            'totalNotifications': user.total_notifications,
        }, status=201)
    return HttpResponseNotAllowed(['PUT'])


@ensure_csrf_cookie
@api_view(['GET'])
def user_list(request):
    """get today naengpa-star user list"""
    if request.method == 'GET':
        user_collection = cache.get('users')
        if not user_collection:
            user_collection = [{
                "id": user.id,
                "username": user.username,
                "name": user.name,
                "email": user.email,
                "dateOfBirth": user.date_of_birth,
                'region': get_region(user.region),
                "naengpaScore": user.naengpa_score,
                'profileImage': user.profile_image,
            } for user in User.objects.select_related('region').order_by('-naengpa_score')[:2]] if User.objects.count() else []
            cache.set('users', user_collection)
        return JsonResponse(user_collection, safe=False)


@ensure_csrf_cookie
@api_view(['GET', 'POST'])
@login_required_401
def user_fridge(request, id):
    """GET /api/users/:id/fridge/ Get Ingredient list in the fridge of the given user"""
    """POST /api/users/:id/fridge/ Add new ingredient to the fridge of the given user"""
    if request.method == 'GET':
        try:
            user = User.objects.get(id=id)
            ingredient_list = [
                ingredient for ingredient in FridgeIngredient.objects.filter(
                    fridge=user.fridge
                ).all().values(
                    'ingredient__id', 'ingredient__name', 'ingredient__category__name', 'is_today_ingredient'
                ).order_by('-created_at')]
        except User.DoesNotExist:
            return HttpResponseBadRequest()
        return JsonResponse(ingredient_list, safe=False)
    elif request.method == 'POST':
        try:
            user = User.objects.get(id=id)
            ingredient_id = request.data['ingredient_id']
            ingredient = Ingredient.objects.get(id=ingredient_id)
            FridgeIngredient.objects.get_or_create(
                fridge=user.fridge, ingredient=ingredient)

            ingredient_list = [
                ingredient for ingredient in FridgeIngredient.objects.filter(fridge=user.fridge).all().values('ingredient__id', 'ingredient__name', 'ingredient__category__name', 'is_today_ingredient').order_by('-created_at')]
        except (User.DoesNotExist, KeyError, json.decoder.JSONDecodeError):
            return HttpResponseBadRequest()
        except Ingredient.DoesNotExist:
            return HttpResponseNotFound()
        return JsonResponse(ingredient_list, status=201, safe=False)


@ensure_csrf_cookie
@api_view(['PUT', 'DELETE'])
@login_required_401
def user_ingredient(request, user_id, id):
    """PUT /api/users/:user_id/ingredients/:id/ Toggle ingredient's is_today_ingredient attribute of the given user"""
    """DELETE /api/users/:user_id/ingredients/:id/ Delete ingredient from the fridge of the given user"""
    if request.method == 'PUT':
        try:
            user = User.objects.get(id=user_id)
            ingredient = Ingredient.objects.get(id=id)
            target_ingredient = FridgeIngredient.objects.filter(
                fridge=user.fridge).all().get(ingredient=ingredient)
            target_ingredient.is_today_ingredient = not target_ingredient.is_today_ingredient
            target_ingredient.save()
            ingredient_list = [
                ingredient for ingredient in FridgeIngredient.objects.filter(fridge=user.fridge).all().values('ingredient__id', 'ingredient__name', 'ingredient__category__name', 'is_today_ingredient').order_by('-created_at')]
        except User.DoesNotExist:
            return HttpResponseNotFound()
        except Ingredient.DoesNotExist:
            return HttpResponseNotFound()
        return JsonResponse(ingredient_list, safe=False)
    elif request.method == 'DELETE':
        try:
            user = User.objects.get(id=user_id)
            ingredient = Ingredient.objects.get(id=id)
            user.fridge.ingredients.remove(ingredient)
            ingredient_list = [
                ingredient for ingredient in FridgeIngredient.objects.filter(fridge=user.fridge).all().values('ingredient__id', 'ingredient__name', 'ingredient__category__name', 'is_today_ingredient').order_by('-created_at')]
        except User.DoesNotExist:
            return HttpResponseBadRequest()
        except Ingredient.DoesNotExist:
            return HttpResponseNotFound()
        return JsonResponse(ingredient_list, safe=False)


@ensure_csrf_cookie
@api_view(['DELETE'])
@login_required_401
def notification_info(request, id):
    """soft-delete notification of given id"""
    if request.method == 'DELETE':
        notification = get_object_or_404(Notification, pk=id)
        notification.delete()  # overriden delete method
        return JsonResponse(data={
            'id': notification.id,
            'content': notification.content,
            'deleted': notification.deleted,
            'createdAt': notification.created_string,
        })
