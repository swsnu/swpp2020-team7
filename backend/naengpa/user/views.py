"""views for user"""
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseForbidden, HttpResponseNotFound, HttpResponseNotAllowed, JsonResponse
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import Fridge, FridgeIngredient
from ingredient.models import Ingredient

import json

User = get_user_model()


@ensure_csrf_cookie
def signup(request):
    """signup"""
    if request.method == 'POST':
        try:
            req_data = json.loads(request.body.decode())
            username = req_data['username']
            name = req_data['name']
            password = req_data['password']
            date_of_birth = req_data['dateOfBirth']
            email = req_data['email']
        except (KeyError, json.decoder.JSONDecodeError):
            return HttpResponseBadRequest()

        user = User.objects.create_user(
            username=username,
            password=password,
            email=email,
            name=name,
            date_of_birth=date_of_birth
        )
        user.save()
        my_fridge = Fridge(user=user)
        my_fridge.save()

        checked_user = authenticate(
            request, username=username, password=password)

        if checked_user is not None:
            login(request, checked_user)
            return JsonResponse(data={
                'id': checked_user.id,
                'username': checked_user.username,
                'email': checked_user.email,
                'name': checked_user.name,
                'dateOfBirth': checked_user.date_of_birth,
                'naengpa_score': checked_user.naengpa_score
            }, status=201)
        else:
            return HttpResponse(status=500)
    return HttpResponseNotAllowed(['POST'])


@ensure_csrf_cookie
def signin(request):
    """signin"""
    if request.method == 'POST':
        try:
            req_data = json.loads(request.body.decode())
            username = req_data['username']
            password = req_data['password']
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
                'naengpa_score': user.naengpa_score
            }, status=200)
        else:
            return HttpResponse(status=401)
    return HttpResponseNotAllowed(['POST'])


@ensure_csrf_cookie
def signout(request):
    """signout"""
    if request.method == 'GET':
        if request.user.is_authenticated:
            logout(request)
            return HttpResponse(status=204)
        return HttpResponse(status=401)
    return HttpResponseNotAllowed(['GET'])


@ensure_csrf_cookie
def user_list(request):
    """user_list"""
    # GET USER LIST
    if request.method == 'GET':
        user_collection = [{
            "id": user.id,
            "username": user.username,
            "name": user.name,
            "email": user.email,
            "dateOfBirth": user.date_of_birth,
            "naengpa_score": user.naengpa_score
        } for user in User.objects.all()] if len(User.objects.all()) != 0 else []
        return JsonResponse(user_collection, safe=False)
    else:
        return HttpResponseNotAllowed(['GET'])


@ensure_csrf_cookie
def user_fridge(request, id):
    """GET /api/users/:id/fridge/ Get Ingredient list in the fridge of the given user"""
    """POST /api/users/:id/fridge/ Add new ingredient to the fridge of the given user"""
    # if request.user.id != id:
    #     return HttpResponseForbidden()
    if request.method == 'GET':
        if not request.user.is_authenticated:
            return HttpResponse(status=401)
        try:
            user = User.objects.get(id=id)
            ingredient_list = [
                ingredient for ingredient in FridgeIngredient.objects.filter(fridge=user.fridge).all().values('ingredient__id', 'ingredient__name', 'ingredient__category__name', 'is_today_ingredient')]
        except User.DoesNotExist:
            return HttpResponseBadRequest()
        return JsonResponse(ingredient_list, safe=False)
    elif request.method == 'POST':
        if not request.user.is_authenticated:
            return HttpResponse(status=401)
        try:
            user = User.objects.get(id=id)
            req_data = json.loads(request.body.decode())
            ingredient_id = req_data['ingredient_id']
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
    else:
        return HttpResponseNotAllowed(['GET'])


@ensure_csrf_cookie
def user_ingredient(request, user_id, id):
    """DELETE /api/users/:user_id/ingredients/id/ Delete ingredient from the fridge of the given user"""
    # if request.user.id != id:
    #     return HttpResponseForbidden()
    if request.method == 'DELETE':
        if not request.user.is_authenticated:
            return HttpResponse(status=401)
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
    else:
        return HttpResponseNotAllowed(['DELETE'])
