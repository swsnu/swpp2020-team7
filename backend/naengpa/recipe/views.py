"""views for recipe"""
import json
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest, HttpResponseForbidden,  HttpResponseNotFound, HttpResponseNotAllowed
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import Recipe, Image, RecipeIngredient, RecipeLike
from food_category.models import FoodCategory
from django.db.models import Q
from django.core import serializers
from django.db import transaction
from utils.aws_utils import upload_images
from operator import itemgetter


@ensure_csrf_cookie
@transaction.atomic
def recipe_list(request):
    """get recipe list"""
    if request.method not in ['GET', 'POST']:
        return HttpResponseNotAllowed(['GET', 'POST'])

    if not request.user.is_authenticated:
        return HttpResponse(status=401)

    if request.method == 'GET':
        ''' GET /api/recipes/ get recipe list '''
        if not Recipe.objects.count():
            return JsonResponse({})

        query = request.GET.get('value', "")
        selected_list = Recipe.objects.select_related(
            'author')
        sorted_list = selected_list.filter(Q(recipe_content__contains=query) | Q(food_name__contains=query)).order_by('-created_at') if query else \
            selected_list.order_by('-created_at')

        recipe_collection = [{
            "id": recipe.id,
            "authorId": recipe.author.id,
            "author": recipe.author.username,
            "foodName": recipe.food_name,
            "cookTime": recipe.cook_time,
            "recipeContent": recipe.recipe_content,
            "foodImages": list(recipe.images.values('id', 'file_path')),
            "recipeLike": recipe.likes.count(),
            "createdAt": recipe.created_at.strftime("%Y.%m.%d"),
            "foodCategory": recipe.food_category,
            "ingredients": list(recipe.ingredients.values('id', 'ingredient', 'quantity')),
        } for recipe in sorted_list]
        return JsonResponse(recipe_collection, safe=False)

    else:
        ''' POST /api/recipes/ post new recipe '''
        try:
            user_id = request.user.id
            req_data = eval(request.POST.dict().get('recipe', ''))
            food_name, cook_time, recipe_content, food_category_str, ingredients = itemgetter(
                'foodName', 'cookTime', 'recipeContent', 'foodCategory', 'ingredients')(req_data)
            food_images = request.FILES.getlist('image')

            recipe = Recipe.objects.create(
                author_id=user_id,
                food_name=food_name,
                cook_time=cook_time,
                recipe_content=recipe_content,
                food_category=food_category_str,
            )

            print(ingredients, "list")
            ingredient_list = [RecipeIngredient.objects.create(
                ingredient=item.get('ingredient', ''), quantity=item.get('quantity', ''), recipe_id=recipe.id
            ) for item in eval(str(ingredients))]

            print("[Ingredient List] ", ingredient_list)
        except (KeyError, json.decoder.JSONDecodeError):
            return HttpResponseBadRequest()
        except FoodCategory.DoesNotExist:
            return HttpResponseBadRequest()

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
            "foodImages": list(recipe.images.values('id', 'file_path')),
            "recipeContent": recipe_content,
            "recipeLike": recipe.likes.count(),
            "createdAt": recipe.created_at,
            "foodCategory": recipe.food_category,
            "ingredients": list(recipe.ingredients.values('id', 'ingredient', 'quantity')),
        }, status=201)


def recipe_info(request, id):
    """get recipe of given id"""
    if request.method not in ['GET', 'DELETE']:
        return HttpResponse(status=405)
    recipe = Recipe.objects.get(id=id)
    response = {
        "id": recipe.id,
        "authorId": recipe.author.id,
        "author": recipe.author.username,
        "foodName": recipe.food_name,
        "cookTime": recipe.cook_time,
        "foodImages": list(recipe.images.values('id', 'file_path')),
        "recipeContent": recipe.recipe_content,
        "recipeLike": recipe.likes.count(),
        "createdAt": recipe.created_at,
        "foodCategory": recipe.food_category,
        "ingredients": list(recipe.ingredients.values('id', 'ingredient', 'quantity')),
    }
    if request.user.is_authenticated:
        if request.method == 'GET':
            return JsonResponse(data=response, status=201)
        if request.method == 'DELETE':
            Recipe.objects.filter(id=id).delete()
            return HttpResponse(status=200)
    else:
        return HttpResponse(status=401)


def recipe_like(request, id):
    """like recipe of given id"""
    if request.method != 'GET':
        return HttpResponseNotAllowed(['GET'])

    if request.user.is_authenticated:
        recipe = Recipe.objects.get(id=id)
        user_id = request.user.id
        user_like = recipe.likes.filter(user_id=user_id)
        if user_like.count() > 0:
            recipe.like_count.get(user_id=user_id).delete()
        else:
            RecipeLike.objects.create(user_id=user_id, recipe_id=recipe.id)

        context = {'likeCounts': recipe.likes.count(),
                   'userLike': user_like.count()}
        return JsonResponse(context, safe=False)

    return HttpResponse(status=401)
