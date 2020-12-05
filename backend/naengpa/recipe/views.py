"""views for recipe"""
import json
from operator import itemgetter
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.core.cache import cache
from django.db import transaction
from rest_framework.decorators import api_view
from utils.aws_utils import upload_images
from food_category.models import FoodCategory
from .models import Recipe, Image, RecipeIngredient, RecipeLike


@api_view(['GET', 'POST'])
@login_required
@transaction.atomic
def recipe_list(request):
    """get recipe list"""
    if request.method == 'GET':
        ''' GET /api/recipes/ get recipe list '''
        if not Recipe.objects.count():
            return JsonResponse([], safe=False)

        query = request.GET.get('value', "")
        user_id = request.user.id

        if not query:
            recipe_collection = cache.get('recipes')
            if not recipe_collection:
                sorted_list = Recipe.objects.select_related(
                    'author')
        else:
            sorted_list = selected_list.filter(Q(recipe_content__icontains=query) | Q(
                food_name__icontains=query) | Q(food_category__icontains=query) | Q(ingredients__ingredient__icontains=query))

            recipe_collection = [{
                "id": recipe.id,
                "authorId": recipe.author.id,
                "author": recipe.author.username,
                "foodName": recipe.food_name,
                "cookTime": recipe.cook_time,
                "recipeContent": recipe.recipe_content,
                "foodImagePaths": list(recipe.images.values('id', 'file_path')),
                "recipeLike": recipe.likes.count(),
                "userLike": recipe.likes.filter(user_id=user_id).count(),
                "createdAt": recipe.created_at.strftime("%Y.%m.%d"),
                "foodCategory": recipe.food_category,
                "ingredients": list(recipe.ingredients.values('id', 'ingredient', 'quantity')),
            } for recipe in sorted_list]
        return JsonResponse(recipe_collection, safe=False)

    else:
        ''' POST /api/recipes/ post new recipe '''
        try:
            user_id = request.user.id
            req_data = eval(request.POST['recipe'])
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
            "foodImagePaths": list(recipe.images.values('id', 'file_path')),
            "recipeContent": recipe_content,
            "recipeLike": recipe.likes.count(),
            "userLike": 0,
            "createdAt": recipe.created_at.strftime("%Y.%m.%d"),
            "foodCategory": recipe.food_category,
            "ingredients": list(recipe.ingredients.values('id', 'ingredient', 'quantity')),
        }, status=201)


@api_view(['GET', 'DELETE'])
@login_required
def recipe_info(request, id):
    """get recipe of given id"""
    recipe = Recipe.objects.get(id=id)
    user_id = request.user.id
    user_like = recipe.likes.filter(user_id=user_id).count()
    response = {
        "id": recipe.id,
        "authorId": recipe.author.id,
        "author": recipe.author.username,
        "foodName": recipe.food_name,
        "cookTime": recipe.cook_time,
        "recipeContent": recipe.recipe_content,
        "foodImagePaths": list(Image.objects.filter(recipe_id=recipe.id).values()),
        "recipeLike": recipe.likes.count(),
        "userLike": user_like,
        "createdAt": recipe.created_at.strftime("%Y.%m.%d"),
        "foodCategory": recipe.food_category,
        "ingredients": list(recipe.ingredients.values('id', 'ingredient', 'quantity')),
    }
    if request.method == 'GET':
        return JsonResponse(data=response, status=201)
    if request.method == 'DELETE':
        Recipe.objects.filter(id=id).delete()
        return HttpResponse(status=200)


@api_view(['GET'])
@login_required
def recipe_like(request, id):
    """like recipe of given id"""

    recipe = Recipe.objects.get(id=id)
    user_id = request.user.id
    user_like = recipe.likes.filter(user_id=user_id)
    user_like_exists = 0

    if user_like.count() > 0:
        recipe.likes.get(user_id=user_id).delete()
    else:
        RecipeLike.objects.create(user_id=user_id, recipe_id=recipe.id)
        user_like_exists = 1
    context = {"recipeLike": recipe.likes.count(),
               "userLike": user_like_exists}
    return JsonResponse(context, safe=False)
