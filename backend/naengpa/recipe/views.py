"""views for recipe"""
import json
from operator import itemgetter
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest
from django.db.models import Q, Count, Value, IntegerField
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
from article.models import Article
from article.views import _get_cache_or_set_article_by_id
from user.models import FridgeIngredient
from .models import Recipe, Image, RecipeIngredient, RecipeLike


def recipe_list_get(request):
    ''' GET /api/recipes/ get recipe list '''
    if not Recipe.objects.count():
        return JsonResponse([], safe=False)
    query = request.GET.get('query', "").rstrip().lstrip()
    sort_condition = request.GET.get('sort_by', "created_at")
    food_category = request.GET.get('category', "")
    page = request.GET.get('page', 1)
    user = request.user

    if query:
        ''' QUERY condition '''
        sorted_list = Recipe.objects.select_related(
            'author', 'food_category'
        ).prefetch_related('ingredients'
                           ).filter(Q(recipe_content__contains=query) | Q(food_name__contains=query)
                                    | Q(food_category__name__contains=query) | Q(ingredients__ingredient__name__contains=query))

        ''' FOOD CATEGORY condition '''
        sorted_list = sorted_list.filter(
            food_category__name=food_category) if food_category != '전체' else sorted_list
        sorted_list = sorted_list.order_by('-id').distinct('id')
    else:
        ''' FOOD CATEGORY condition '''
        sorted_list = Recipe.objects.select_related(
            'author', 'food_category').prefetch_related('ingredients')
        filtered_list = sorted_list.filter(
            food_category__name=food_category) if food_category != '전체' else sorted_list

        ''' CREATED_AT OR LIKES '''
        if sort_condition == "created_at":
            sorted_list = filtered_list.order_by('-created_at')

        elif sort_condition == 'ingredient':
            # ingredient queries in user fridge
            user_ingredients = FridgeIngredient.objects.select_related('ingredient').filter(
                fridge=user.fridge)
            # ingredient queries in today ingredient of user
            today_ingredients = user_ingredients.filter(
                is_today_ingredient=True).values('ingredient__name')
            # sort by Today Ingredients first
            todays_list = filtered_list.filter(ingredients__ingredient__name__in=today_ingredients).annotate(ingredient_count=Count(
                'ingredients__ingredient__name')).order_by('-ingredient_count')
            # sort by Ingredients in user's Fridge except above recipes
            normal_list = filtered_list.exclude(id__in=todays_list.values('id')).filter(ingredients__ingredient__name__in=user_ingredients.values('ingredient__name')).annotate(
                ingredient_count=Count('ingredients__ingredient__name')).order_by('-ingredient_count')
            # union of results in maintenance of Ordering (Sorting result of 'Today Ingredients' comes first)
            sorted_list = (todays_list | normal_list)

        else:
            sorted_list = filtered_list.annotate(
                like_count=Count('likes')).order_by('-like_count')

    paginator = Paginator(sorted_list, 9)
    sorted_list = paginator.get_page(page)
    recipe_collection = [{
        "id": recipe.id,
        "authorId": recipe.author.id,
        "author": recipe.author.username,
        "profileImage": recipe.author.profile_image,
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
        } for item in recipe.ingredients.all()],
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
            RecipeIngredient.objects.create(
                ingredient=Ingredient.objects.get(name=item.get('name', '')), quantity=item.get('quantity', ''), recipe_id=recipe.id
            )
    except (KeyError, json.decoder.JSONDecodeError):
        return HttpResponseBadRequest()
    except FoodCategory.DoesNotExist:
        return HttpResponseBadRequest()
    except Ingredient.DoesNotExist as e:
        print("[레시피 생성] 잘못된 재료 입력입니다: {}".format(str(e)))
        return HttpResponseBadRequest()

    images_path = upload_images(
        food_images, "recipe", recipe.id)
    for path in images_path:
        Image.objects.create(file_path=path, recipe_id=recipe.id)

    return {
        "id": recipe.id,
        "authorId": recipe.author.id,
        "author": recipe.author.username,
        "profileImage": recipe.author.profile_image,
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
        } for item in recipe.ingredients.all()],
        "comments": [],
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
@transaction.atomic
def today_recipe_list(request):
    """ get Today recipe list """
    today_recipe_collection = cache.get('today_recipes')
    if not today_recipe_collection:
        yesterday = timezone.now()-timezone.timedelta(days=1)
        user_id = request.user.id

        if Recipe.objects.filter(created_at__gte=yesterday).count() > 4:
            sorted_list = Recipe.objects.select_related(
                'author', 'food_category'
            ).prefetch_related(
                'ingredients', 'likes'
            ).filter(
                created_at__gte=yesterday
            ).annotate(
                like_count=Count('likes')
            ).order_by('-like_count')[:4]
        else:
            sorted_list = Recipe.objects.select_related(
                'author', 'food_category'
            ).prefetch_related(
                'ingredients', 'likes'
            ).annotate(
                like_count=Count('likes')
            ).order_by('-like_count')[:4]

        today_recipe_collection = [{
            "id": recipe.id,
            "authorId": recipe.author.id,
            "author": recipe.author.username,
            "profileImage": recipe.author.profile_image,
            "foodName": recipe.food_name,
            "cookTime": recipe.cook_time,
            "foodImagePaths": list(recipe.images.values('id', 'file_path')),
            "content": recipe.recipe_content,
            "recipeLike": recipe.likes.count(),
            "userLike": recipe.likes.filter(user_id=user_id).count(),
            "createdAt": recipe.created_at.strftime("%Y.%m.%d"),
            "foodCategory": recipe.food_category.name,
        } for recipe in sorted_list]
        cache.set('today_recipes', today_recipe_collection)
    return JsonResponse({"recipeList": today_recipe_collection, "lastPageIndex": 4}, safe=False)


@ensure_csrf_cookie
@api_view(['GET', 'DELETE'])
@login_required_401
def recipe_info(request, id):
    """get recipe of given id"""
    if request.method == 'GET':
        recipe_response = cache.get('recipe:{}'.format(id))
        if not recipe_response:
            user_id = request.user.id
            recipe = Recipe.objects.select_related('author', 'food_category').prefetch_related(
                'images', 'likes', 'ingredients', 'comments').get(id=id)
            recipe_response = {
                "id": recipe.id,
                "authorId": recipe.author.id,
                "author": recipe.author.username,
                "profileImage": recipe.author.profile_image,
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
                "comments": [{
                    "id": item.id,
                    "author": item.author.name,
                    "profileImage": item.author.profile_image,
                    "recipeId": recipe.id,
                    "content": item.content,
                    "createdAt": item.created_string,
                } for item in recipe.comments.all()]
            }
            cache.set('recipe:{}'.format(id), recipe_response)

        user_ingredient_ids = set(FridgeIngredient.objects.filter(
            fridge=request.user.fridge).values_list('ingredient__id', flat=True))
        recipe_ingredient_ids = set(RecipeIngredient.objects.filter(
            recipe_id=id).values_list('ingredient__id', flat=True))
        missing_ingredient_ids = recipe_ingredient_ids - user_ingredient_ids

        included_region_ids = request.user.region.neighborhoodregion_set.filter(
            region_range=request.user.region_range).values_list('neighborhood_id', flat=True)

        related_article_ids = Article.objects.exclude(
            done=True
        ).exclude(
            author_id=request.user.id
        ).filter(
            Q(author__region__id__in=included_region_ids) &
            Q(item__id__in=missing_ingredient_ids)
        ).values_list('id', flat=True)

        related_articles = [_get_cache_or_set_article_by_id(
            aid) for aid in related_article_ids]
        return JsonResponse(data={
            "recipe": recipe_response,
            "relatedArticles": related_articles
        }, safe=False)
    elif request.method == 'DELETE':
        Recipe.objects.filter(id=id).delete()
        return HttpResponse(status=204)


@ensure_csrf_cookie
@api_view(['PUT'])
@login_required_401
@transaction.atomic
def recipe_like(request, id):
    """like recipe of given id"""
    user_id = request.user.id
    try:
        like = RecipeLike.objects.get(recipe_id=id, user_id=user_id)
        like.delete()
        is_like = 0
    except RecipeLike.DoesNotExist:
        like = RecipeLike.objects.create(recipe_id=id, user_id=user_id)
        is_like = 1

    context = {"recipeLike": RecipeLike.objects.filter(recipe_id=id).count(),
               "userLike": 1 if is_like else 0}
    return JsonResponse(context, safe=False)
