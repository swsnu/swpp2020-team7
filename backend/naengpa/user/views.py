"""views for user"""
# from django.shortcuts import render
import json
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseNotAllowed, JsonResponse
from django.contrib.auth import get_user_model
# , update_session_auth_hash
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from .models import Profile
# from django.contrib import auth
# from django.core.serializers.json import DjangoJSONEncoder

User = get_user_model()


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
            username=username, password=password, email=email)
        user.profile.name = name
        user.profile.date_of_birth = date_of_birth
        user.save()

        checked_user = authenticate(
            request, username=username, password=password)

        if checked_user is not None:
            login(request, checked_user)
            return JsonResponse({
                'id': checked_user.id,
                'username': checked_user.username,
                'email': checked_user.email,
                'name': checked_user.profile.name,
                'dateOfBirth': checked_user.profile.date_of_birth
            }, status=204)
        else:
            return HttpResponse(status=201)
    return HttpResponseNotAllowed(['POST'])


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
            return JsonResponse({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'name': user.profile.name,
                'dateOfBirth': user.profile.date_of_birth
            }, status=204)
        else:
            return HttpResponse(status=403)
    return HttpResponseNotAllowed(['POST'])


def signout(request):
    """signout"""
    if request.method == 'GET':
        if request.user.is_authenticated:
            logout(request)
            print(request.user.is_authenticated, "logout done")
            return HttpResponse(status=204)
        return HttpResponse(status=401)
    return HttpResponseNotAllowed(['GET'])


def user_list(request):
    """user_list"""
    user_collection = [{
        "username": user.username,
        "name": user.profile.name,
        "password": user.password,
        "email": user.email,
        "dateOfBirth": user.profile.date_of_birth,
        "is_logged_in": user.is_authenticated,
    } for user in User.objects.all()] if len(User.objects.all()) != 0 else []
    print(user_collection)
    print(User.objects.all())
    # GET USER LIST
    if request.method == 'GET':
        return JsonResponse(user_collection, safe=False)

    return JsonResponse([], safe=False)


@ ensure_csrf_cookie
def token(request):
    """token"""
    if request.method == 'GET':
        return HttpResponse(status=204)
    return HttpResponseNotAllowed(['GET'])
