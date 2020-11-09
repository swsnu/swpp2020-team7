"""views for user"""
#from django.shortcuts import render
import json
from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from django.contrib.auth.models import User
# , update_session_auth_hash
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import Profile
# from django.contrib import auth
#from django.core.serializers.json import DjangoJSONEncoder

# Create your views here.


def signup(request):
    """signup"""
    if request.method == 'POST':
        req_data = json.loads(request.body.decode())
        username = req_data['username']
        name = req_data['name']
        password = req_data['password']
        date_of_birth = req_data['date_of_birth']
        email = req_data['email']

        user = User.objects.create_user(
            username=username, password=password, email=email)
        user.profile.name = name
        user.profile.date_of_birth = date_of_birth
        user.save()

        checked_user = authenticate(
            request, username=username, password=password)
        login(request, checked_user)
        print(user)
        print(User.objects.all())
        return HttpResponse(status=201)
    return HttpResponseNotAllowed(['POST'])


def signin(request):
    """signin"""
    if request.method == 'POST':
        req_data = json.loads(request.body.decode())
        username = req_data['username']
        password = req_data['password']

        print(req_data, "received data")
        user = authenticate(
            request, username=username, password=password)

        if user is not None:
            login(request, user)
            print(user)
            print(User.objects.all())
            return HttpResponse(status=204)
        print("error")
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
        "date_of_birth": user.profile.date_of_birth,
        "is_logged_in": user.is_authenticated,
    } for user in User.objects.all()] if len(User.objects.all()) != 0 else []
    print(user_collection)
    print(User.objects.all())
    # GET USER LIST
    if request.method == 'GET':
        return JsonResponse(user_collection, safe=False)

    return JsonResponse([], safe=False)


@ensure_csrf_cookie
def token(request):
    """token"""
    if request.method == 'GET':
        return HttpResponse(status=204)
    return HttpResponseNotAllowed(['GET'])
