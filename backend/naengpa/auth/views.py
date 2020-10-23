from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

# Create your views here.
def signup(request):
    return HttpResponse('signup page')

def login(reqeust):
    return HttpResponse('login page')
