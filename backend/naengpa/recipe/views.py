"""views for recipe"""
import json
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest, HttpResponseForbidden,  HttpResponseNotFound, HttpResponseNotAllowed
from django.views.decorators.csrf import ensure_csrf_cookie
from django.core import serializers
from django.db import transaction
from utils.aws_utils import upload_images
from .models import Recipe, Image


@ensure_csrf_cookie
@transaction.atomic
def recipe_list(request):
    """get recipe list"""
    if request.method != 'GET' and request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])
    query = request.GET.get('value', "")
    sorted_list = Recipe.objects.all().order_by('-created_at')
    if query != "":
        sorted_list = sorted_list.filter(
            recipe_content__contains=query) | Recipe.objects.filter(food_name__contains=query)

    recipe_collection = [{
        "id": recipe.id,
        "authorId": recipe.author.id,
        "author": recipe.author.username,
        "foodName": recipe.food_name,
        "cookTime": recipe.cook_time,
        "recipeContent": recipe.recipe_content,
        "foodImages": Image.objects.filter(recipe_id=recipe.id).values(),
        "recipeLike": 0,
        "createdAt": recipe.created_at.strftime("%Y.%m.%d")
    } for recipe in sorted_list] if len(sorted_list) != 0 else []

    if request.user.is_authenticated:
        if request.method == 'GET':
            ''' GET /api/recipes/ get recipe list '''
            return JsonResponse(recipe_collection, safe=False)

        else:
            ''' POST /api/recipes/ post new recipe '''
            user_id = request.user.id
            req_data = eval(request.POST.dict().get('recipe', ''))
            food_images = request.FILES.getlist('image')
            food_name = req_data['foodName']
            cook_time = req_data['cookTime']
            recipe_content = req_data['recipeContent']

            recipe = Recipe.objects.create(
                author_id=user_id,
                food_name=food_name,
                cook_time=cook_time,
                recipe_content=recipe_content)

            images_path = upload_images(
                food_images, "recipe", recipe.id, user_id)
            for path in images_path:
                Image.objects.create(file_path=path, recipe_id=recipe.id)

            return JsonResponse(data={
                "id": recipe.id,
                "authorId": recipe.author.id,
                "author": recipe.author.username,
                "foodName": food_name,
                "cookTime": cook_time,
                "foodImages": Image.objects.filter(recipe_id=recipe.id).values(),
                "recipeContent": recipe_content,
                "recipeLike": 0,
                "createdAt": recipe.created_at,
            }, status=201)
    else:
        return HttpResponse(status=401)


def recipe_info(request, id):
    """get recipe of given id"""
    return HttpResponse(status=405)
