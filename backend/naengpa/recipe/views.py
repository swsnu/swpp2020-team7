"""views for recipe"""
import json
from operator import itemgetter
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest
from django.db.models import Q
from django.core.cache import cache
from django.views.decorators.csrf import ensure_csrf_cookie
from django.db import transaction
from rest_framework.decorators import api_view
from utils.aws_utils import upload_images
from utils.auth import login_required_401
from food_category.models import FoodCategory
from ingredient.models import Ingredient
from .models import Recipe, Image, RecipeIngredient, RecipeLike
from user.models import FridgeIngredient
from django.utils import timezone
from django.core.paginator import Paginator
import numpy as np


def recipe_list_get(request):
    ''' GET /api/recipes/ get recipe list '''
    if not Recipe.objects.count():
        return JsonResponse([], safe=False)

    query = request.GET.get('query', "")
    sort_condition = request.GET.get('sort_by', "created_at")
    food_category = request.GET.get('category', "")
    page = request.GET.get('page', 1)

    user = request.user

    # TODO: sort by ingredient
    # if sort_condition == "ingredient":

    if query:
        ''' QUERY condition '''
        sorted_list = Recipe.objects.all().filter(Q(recipe_content__contains=query) | Q(food_name__contains=query)
                                                  | Q(food_category__contains=query) | Q(ingredients__ingredient__contains=query)).distinct('id')

        ''' FOOD CATEGORY condition '''
        sorted_list = sorted_list.filter(
            food_category=food_category) if food_category != '전체' else sorted_list

    else:
        ''' FOOD CATEGORY condition '''
        sorted_list = Recipe.objects.all().filter(
            food_category=food_category) if food_category != '전체' else Recipe.objects.all()

        ''' CREATED_AT OR LIKES '''
        if sort_condition == "created_at":
            sorted_list = sorted_list.order_by('-created_at')
        else:
            sorted_list = list(sorted_list)
            sorted_list = sorted(
                sorted_list, key=lambda x: -x.likes.count())
    paginator = Paginator(sorted_list, 9)
    sorted_list = paginator.get_page(page)

    recipe_collection = [{
        "id": recipe.id,
        "authorId": recipe.author.id,
        "author": recipe.author.username,
        "foodName": recipe.food_name,
        "cookTime": recipe.cook_time,
        "content": recipe.recipe_content,
        "foodImagePaths": list(recipe.images.values('id', 'file_path')),
        "recipeLike": recipe.like_users.count(),
        "userLike": recipe.likes.filter(user_id=user.id).count(),
        "createdAt": recipe.created_at.strftime("%Y.%m.%d"),
        "foodCategory": recipe.food_category,
        "ingredients": list(recipe.ingredients.values('id', 'ingredient', 'quantity')),
    } for recipe in sorted_list]

    return {
        "recipeList": recipe_collection,
        "lastPageIndex": paginator.count
    }


def recipe_list_post(request):
    ''' POST /api/recipes/ post new recipe '''
    try:
        user_id = request.user.id
        req_data = json.loads(request.POST.get('recipe'))
        food_name, cook_time, recipe_content, food_category_str, ingredients = itemgetter(
            'foodName', 'cookTime', 'content', 'foodCategory', 'ingredients')(req_data)
        food_images = request.FILES.getlist('image')
        recipe = Recipe.objects.create(
            author_id=user_id,
            food_name=food_name,
            cook_time=cook_time,
            recipe_content=recipe_content,
            food_category=food_category_str,
        )

        request.user.naengpa_score += 100
        request.user.save()

        ingredient_list = [RecipeIngredient.objects.create(
            ingredient=item.get('ingredient', ''), quantity=item.get('quantity', ''), recipe_id=recipe.id
        ) for item in eval(str(ingredients))]
    except (KeyError, json.decoder.JSONDecodeError):
        return HttpResponseBadRequest()
    except FoodCategory.DoesNotExist:
        return HttpResponseBadRequest()

    images_path = upload_images(
        food_images, "recipe", recipe.id)
    for path in images_path:
        Image.objects.create(file_path=path, recipe_id=recipe.id)

    return {
        "id": recipe.id,
        "authorId": recipe.author.id,
        "author": recipe.author.username,
        "foodName": food_name,
        "cookTime": cook_time,
        "foodImagePaths": list(recipe.images.values('id', 'file_path')),
        "content": recipe_content,
        "recipeLike": recipe.like_users.count(),
        "userLike": 0,
        "createdAt": recipe.created_at.strftime("%Y.%m.%d"),
        "foodCategory": recipe.food_category,
        "ingredients": list(recipe.ingredients.values('id', 'ingredient', 'quantity')),
    }


@ensure_csrf_cookie
@api_view(['GET', 'POST'])
@login_required_401
@transaction.atomic
def recipe_list(request):
    """get recipe list"""
    '''
        # TODO: Cache "recipes" version option
        1 : sorted by "time" => recent tab
        2 : sorted by "likes" => popular tab
        3 : sorted by "ingredients" => recommend tab
    '''
    if request.method == 'GET':
        return_data = recipe_list_get(request)
        return JsonResponse(data=return_data, safe=False)
    elif request.method == 'POST':
        return_data = recipe_list_post(request)
        return JsonResponse(data=return_data, status=201)


@ ensure_csrf_cookie
@ api_view(['GET'])
@ login_required_401
@ transaction.atomic
def today_recipe_list(request):
    """ get Today recipe list """
    today = timezone.now().strftime('%Y-%m-%d')
    print("[Today]", today)
    yesterday = timezone.now()-timezone.timedelta(days=1)
    print("[Yesterday]", yesterday)
    user_id = request.user.id

    sorted_list = Recipe.objects.filter(created_at__gte=yesterday)
    sorted_list = list(sorted_list)
    sorted_list = sorted(
        sorted_list, key=lambda x: -x.likes.count())

    today_recipe = [{
        "id": recipe.id,
        "authorId": recipe.author.id,
        "author": recipe.author.username,
        "foodName": recipe.food_name,
        "cookTime": recipe.cook_time,
        "foodImagePaths": recipe.images.values('id', 'file_path')[0],
        "content": recipe.recipe_content,
        "recipeLike": recipe.likes.count(),
        "userLike": recipe.likes.filter(user_id=user_id).count(),
        "createdAt": recipe.created_at.strftime("%Y.%m.%d"),
        "foodCategory": recipe.food_category,
    } for recipe in sorted_list[0:4]]
    return JsonResponse({"recipeList": today_recipe, "lastPageIndex": 4}, safe=False)


@ ensure_csrf_cookie
@ api_view(['GET', 'DELETE'])
@ login_required_401
def recipe_info(request, id):
    """get recipe of given id"""
    user_id = request.user.id

    recipe = Recipe.objects.get(id=id)
    recipe_response = {
        "id": recipe.id,
        "authorId": recipe.author.id,
        "author": recipe.author.username,
        "foodName": recipe.food_name,
        "cookTime": recipe.cook_time,
        "content": recipe.recipe_content,
        "foodImagePaths": list(Image.objects.filter(recipe_id=recipe.id).values()),
        "recipeLike": recipe.likes.count(),
        "userLike": recipe.likes.filter(user_id=user_id).count(),
        "createdAt": recipe.created_at.strftime("%Y.%m.%d"),
        "foodCategory": recipe.food_category,
        "ingredients": list(recipe.ingredients.values('id', 'ingredient', 'quantity')),
    }

    if request.method == 'GET':
        return JsonResponse(data=recipe_response, status=200)
    if request.method == 'DELETE':
        Recipe.objects.filter(id=id).delete()
        return HttpResponse(status=204)


@ ensure_csrf_cookie
@ api_view(['PUT'])
@ login_required_401
@ transaction.atomic
def recipe_like(request, id):
    """like recipe of given id"""
    recipe = Recipe.objects.get(id=id)
    user_id = request.user.id
    user_like = recipe.likes.filter(user_id=user_id)

    if user_like.count() > 0:
        RecipeLike.objects.filter(
            Q(recipe_id=recipe.id) & Q(user_id=user_id)).delete()
        request.user.naengpa_score -= 10
    else:
        RecipeLike.objects.create(user_id=user_id, recipe_id=recipe.id)
        request.user.naengpa_score += 10
    request.user.save()

    recipe_response = {
        "id": recipe.id,
        "authorId": recipe.author.id,
        "author": recipe.author.username,
        "foodName": recipe.food_name,
        "cookTime": recipe.cook_time,
        "content": recipe.recipe_content,
        "foodImagePaths": list(Image.objects.filter(recipe_id=recipe.id).values()),
        "recipeLike": recipe.likes.count(),
        "userLike": recipe.likes.filter(user_id=user_id).count(),
        "createdAt": recipe.created_at.strftime("%Y.%m.%d"),
        "foodCategory": recipe.food_category,
        "ingredients": list(recipe.ingredients.values('id', 'ingredient', 'quantity')),
    }

    print(recipe_response)

    context = {"recipeLike": recipe.likes.count(),
               "userLike": recipe.likes.filter(user_id=user_id).count()}
    return JsonResponse(context, safe=False)
