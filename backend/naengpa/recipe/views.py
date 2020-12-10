"""views for recipe"""
import json
import numpy as np
from operator import itemgetter
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest
from django.db.models import Q, Count
from django.core.cache import cache
from django.views.decorators.csrf import ensure_csrf_cookie
from django.db import transaction
from django.utils import timezone
from django.core.paginator import Paginator
from rest_framework.decorators import api_view
from utils.aws_utils import upload_images
from utils.auth import login_required_401
from food_category.models import FoodCategory
from ingredient.models import Ingredient
from .models import Recipe, Image, RecipeIngredient, RecipeLike


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
        sorted_list = Recipe.objects.select_related(
            'author', 'food_category'
        ).prefetch_related('ingredients'
                           ).filter(Q(recipe_content__contains=query) | Q(food_name__contains=query)
                                    | Q(food_category__name__contains=query) | Q(ingredients__ingredient__name__contains=query)).distinct('id')

        ''' FOOD CATEGORY condition '''
        sorted_list = sorted_list.filter(
            food_category__name=food_category) if food_category != '전체' else sorted_list

    else:
        ''' FOOD CATEGORY condition '''
        sorted_list = Recipe.objects.select_related(
            'author', 'food_category').prefetch_related('ingredients')
        filtered_list = sorted_list.filter(
            food_category__name=food_category) if food_category != '전체' else sorted_list

        ''' CREATED_AT OR LIKES '''
        if sort_condition == "created_at":
            sorted_list = filtered_list.order_by('-created_at')
        else:
            sorted_list = filtered_list.annotate(
                like_count=Count('likes')).order_by('-like_count')[:4]

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
        "foodCategory": recipe.food_category.name,
        "ingredients": [{
            "id": item.id,
            "name": item.ingredient.name,
            "quantity": item.quantity,
        } for item in recipe.ingredients.select_related('ingredient')],
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
        food_category = FoodCategory.objects.get(name=food_category_str)
        recipe = Recipe.objects.create(
            author_id=user_id,
            food_name=food_name,
            cook_time=cook_time,
            recipe_content=recipe_content,
            food_category=food_category,
        )

        request.user.naengpa_score += 100
        request.user.save()

        for item in ingredients:
            print(item, item.get('name', ''), item.get('quantity', ''))
            if Ingredient.objects.filter(name=item.get('name', '')).count():
                print(item, "존재 ")
                RecipeIngredient.objects.create(
                    ingredient=Ingredient.objects.get(name=item.get('name', '')), quantity=item.get('quantity', ''), recipe_id=recipe.id
                )
            else:
                print(item, "존재하지 않음")

    except (KeyError, json.decoder.JSONDecodeError):
        return HttpResponseBadRequest()
    except FoodCategory.DoesNotExist:
        return HttpResponseBadRequest()
    except Ingredient.DoesNotExist:
        pass

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
        "foodCategory": recipe.food_category.name,
        "ingredients": [{
            "id": item.id,
            "name": item.ingredient.name,
            "quantity": item.quantity,
        } for item in recipe.ingredients.select_related('ingredient')],
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
        return JsonResponse(data=return_data, status=201, safe=False)


@ensure_csrf_cookie
@api_view(['GET'])
@login_required_401
@transaction.atomic
def today_recipe_list(request):
    """ get Today recipe list """
    today = timezone.now().strftime('%Y-%m-%d')
    print("[Today]", today)
    yesterday = timezone.now()-timezone.timedelta(days=1)
    print("[Yesterday]", yesterday)
    user_id = request.user.id

    sorted_list = Recipe.objects.select_related(
        'author', 'food_category'
    ).prefetch_related(
        'ingredients', 'likes'
    ).filter(
        created_at__gte=yesterday
    ).annotate(
        like_count=Count('likes')
    ).order_by('-like_count')[:4]

    today_recipe = [{
        "id": recipe.id,
        "authorId": recipe.author.id,
        "author": recipe.author.username,
        "foodName": recipe.food_name,
        "cookTime": recipe.cook_time,
        "foodImagePaths": list(recipe.images.values('id', 'file_path')),
        "content": recipe.recipe_content,
        "recipeLike": recipe.likes.count(),
        "userLike": recipe.likes.filter(user_id=user_id).count(),
        "createdAt": recipe.created_at.strftime("%Y.%m.%d"),
        "foodCategory": recipe.food_category.name,
    } for recipe in sorted_list]
    return JsonResponse({"recipeList": today_recipe, "lastPageIndex": 4}, safe=False)


@ensure_csrf_cookie
@api_view(['GET', 'DELETE'])
@login_required_401
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
        "foodImagePaths": list(recipe.images.values('id', 'file_path')),
        "recipeLike": recipe.likes.count(),
        "userLike": recipe.likes.filter(user_id=user_id).count(),
        "createdAt": recipe.created_at.strftime("%Y년 %m월 %d일 %H:%M"),
        "foodCategory": recipe.food_category.name,
        "ingredients": [{
            "id": item.id,
            "name": item.ingredient.name,
            "quantity": item.quantity,
        } for item in recipe.ingredients.select_related('ingredient')],
    }

    if request.method == 'GET':
        return JsonResponse(data=recipe_response, safe=False)
    if request.method == 'DELETE':
        Recipe.objects.filter(id=id).delete()
        return HttpResponse(status=204)


@ensure_csrf_cookie
@api_view(['PUT'])
@login_required_401
@transaction.atomic
def recipe_like(request, id):
    """like recipe of given id"""
    recipe = Recipe.objects.get(id=id)
    user_id = request.user.id
    user_like = recipe.likes.filter(user_id=user_id)

    if not user_like.count():
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
        "foodImagePaths": list(recipe.images.values('id', 'file_path')),
        "recipeLike": recipe.likes.count(),
        "userLike": recipe.likes.filter(user_id=user_id).count(),
        "createdAt": recipe.created_at.strftime("%Y.%m.%d"),
        "foodCategory": recipe.food_category.name,
        "ingredients": [{
            "id": item.id,
            "name": item.ingredient.name,
            "quantity": item.quantity,
        } for item in recipe.ingredients.select_related('ingredient')],
    }

    context = {"recipeLike": recipe.likes.count(),
               "userLike": recipe.likes.filter(user_id=user_id).count()}
    return JsonResponse(context, safe=False)
