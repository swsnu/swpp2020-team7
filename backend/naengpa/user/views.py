from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
# Create your views here.

def user_list(request):
    return JsonResponse([], safe=False)

def user(reqeust):
    return JsonResponse([], safe=False)

def fridge(request):
    return JsonResponse([], sage=False)
