"""views for user"""
# from django.shortcuts import render
from django.http import JsonResponse
# Create your views here.


def signup(request):
    """signup"""
    return JsonResponse([], safe=False)


def login(request):
    """login"""
    return JsonResponse([], safe=False)


def user_list(request):
    """user_list"""
    return JsonResponse([], safe=False)


def user(request):
    """user"""
    return JsonResponse([], safe=False)


def fridge(request):
    """fridge"""
    return JsonResponse([], sage=False)
