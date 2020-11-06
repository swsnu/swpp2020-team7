import json
from django.shortcuts import render
from django.contrib.auth.models import User 
from django.contrib.auth import authenticate as django_authenticate
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import *

@ensure_csrf_cookie
def recipe_list(request):
    if request.method != 'GET' and request.method != 'POST': 
        return HttpResponse(status=405)

    # if request.user.is_authenticated:
    recipe_list = [{"id": recipe.id, "food-name": recipe.food_name, "cook-time": recipe.cook_time,  
                    "recipe-content": recipe.recipe_content, "food-images": list(Image.objects.filter(recipes_id=recipe.id).values()), "recipe-like": 0 
                      } for recipe in Recipe.objects.all()] if len(Recipe.objects.all()) != 0 else []

    # GET RECIPE LIST 
    if request.method == 'GET': 
        return JsonResponse(recipe_list, safe=False)

    # CREATE NEW RECIPE
    elif request.method == 'POST': 
        req_data = json.loads(request.body.decode())
        food_name = req_data['food-name']
        cook_time = req_data['cook-time']
        recipe_content = req_data['recipe-content']
        food_images = req_data['food-images']
        # recipe_like = req_data['recipe-like']
        recipe = Recipe.objects.create(food_name = food_name, cook_time = cook_time, recipe_content=recipe_content)

        for item in food_images:
          Image.objects.create(file_path=item, recipes_id=recipe.id)

        response_dict = {"id": recipe.id, "food-name": food_name, "cook-time": cook_time, 
                    "recipe-content": recipe_content, "food-images": food_images, "recipe_like": 0}
                      
        return JsonResponse(response_dict, status=201)

    # else:
    #     return HttpResponse(status=401)



def recipe(request):
    if request.method != 'GET' and request.method != 'POST':
        return HttpResponse(status=405)

 