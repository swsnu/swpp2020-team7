"""views for user"""
import json
from operator import itemgetter
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseNotFound, HttpResponseNotAllowed, JsonResponse
from django.contrib.auth import get_user_model, authenticate, login, logout
from django.contrib.auth.hashers import check_password
from django.contrib.auth.decorators import login_required
from django.core.cache import cache
from django.db import transaction
from rest_framework.decorators import api_view

from ingredient.models import Ingredient
from utils.gis_utils import get_nearest_places_from_region
from .models import Fridge, FridgeIngredient, Region

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


@api_view(['GET'])
def get_region_info(request):
    """ get region list information for searching Region """
    try:
        """ get region list from seoul's center('종로', id:44) """
        region_list = get_region_list()
    except Region.DoesNotExist:
        return HttpResponseBadRequest()

    return JsonResponse(region_list, safe=False)


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
            "regionRange": user.region_range,
        }, status=201)


@api_view(['POST'])
def signin(request):
    """signin"""
    if request.method == 'POST':
        try:
            username = request.data['username']
            password = request.data['password']
        except (KeyError, json.decoder.JSONDecodeError):
            return HttpResponseBadRequest()

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
                "regionRange": user.region_range,
            }, status=200)
        else:
            return HttpResponse(status=401)
    return HttpResponseNotAllowed(['POST'])


@api_view(['GET'])
@login_required
def signout(request):
    """signout"""
    if request.method == 'GET':
        logout(request)
        return HttpResponse(status=204)


@api_view(['GET', 'PUT'])
@login_required
def user(request, id):
    """user"""
    # GET USER
    if request.method == 'GET':
        user = User.objects.select_related('region').get(id=id)
        current_user = {
            "id": user.id,
            "username": user.username,
            "name": user.name,
            "email": user.email,
            "dateOfBirth": user.date_of_birth,
            'naengpaScore': user.naengpa_score,
            "region": get_region(user.region),
            "regionRange": user.region_range,
        }
        return JsonResponse(data=current_user, safe=False)
    elif request.method == 'PUT':
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return HttpResponseBadRequest()
        try:
            edit_name = request.data['name']
            edit_date_of_birth = request.data['dateOfBirth']
            edit_email = request.data['email']
            checked_password = request.data['password']
        except (KeyError, json.decoder.JSONDecodeError):
            return HttpResponseBadRequest()
        if check_password(checked_password, request.user.password):
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
        }, status=201)


@api_view(['GET'])
@login_required
def user_list(request):
    """user_list"""
    # GET USER LIST
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
                "naengpaScore": user.naengpa_score
            } for user in User.objects.select_related('region').all()] if User.objects.count() != 0 else []
            cache.set('users', user_collection)
        return JsonResponse(user_collection, safe=False)


@api_view(['GET', 'POST'])
@login_required
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
                ingredient for ingredient in FridgeIngredient.objects.filter(fridge=user.fridge).all().values('ingredient__id', 'ingredient__name', 'ingredient__category__name', 'is_today_ingredient')]
        except (User.DoesNotExist, KeyError, json.decoder.JSONDecodeError):
            return HttpResponseBadRequest()
        except Ingredient.DoesNotExist:
            return HttpResponseNotFound()
        return JsonResponse(ingredient_list, status=201, safe=False)


@api_view(['PUT', 'DELETE'])
@login_required
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
                ingredient for ingredient in FridgeIngredient.objects.filter(fridge=user.fridge).all().values('ingredient__id', 'ingredient__name', 'ingredient__category__name', 'is_today_ingredient')]
        except User.DoesNotExist:
            return HttpResponseBadRequest()
        except Ingredient.DoesNotExist:
            return HttpResponseNotFound()
        return JsonResponse(ingredient_list, safe=False)
    elif request.method == 'DELETE':
        try:
            user = User.objects.get(id=user_id)
            ingredient = Ingredient.objects.get(id=id)
            user.fridge.ingredients.remove(ingredient)
            ingredient_list = [
                ingredient for ingredient in FridgeIngredient.objects.filter(fridge=user.fridge).all().values('ingredient__id', 'ingredient__name', 'ingredient__category__name', 'is_today_ingredient')]
        except User.DoesNotExist:
            return HttpResponseBadRequest()
        except Ingredient.DoesNotExist:
            return HttpResponseNotFound()
        return JsonResponse(ingredient_list, safe=False)
