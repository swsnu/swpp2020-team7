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
from user.models import FridgeIngredient
from django.utils import timezone


@api_view(['GET', 'POST'])
@login_required
@transaction.atomic
def recipe_list(request):
    """get recipe list"""
    if request.method == 'GET':
        ''' GET /api/recipes/ get recipe list '''
        if not Recipe.objects.count():
            return JsonResponse([], safe=False)

        query = request.GET.get('query', "")
        sort_condition = request.GET.get('sort_by', "-created_at")
        food_category = request.GET.get('category', "")
        sort_by_ingredient = request.GET.get('filter', False)
        str_idx = int(request.GET.get('page', 0))
        end_idx = int(str_idx) + 9

        user = request.user
        print("search-query:", query, " -category:", food_category, " sort by: ", sort_condition,
              " sort by ingredient: ", sort_by_ingredient)

        # User Clicks the Filter Tab(most recent, most popular and most recommended button)
        if not query:
            if sort_by_ingredient == 'true':
                # Sort by User Ingredients in fridge and today's ingredient
                user_ingredients = FridgeIngredient.objects.filter(
                    fridge=user.fridge).all()

                result = [(recipe, (user_ingredients.intersection(FridgeIngredient.objects.filter(fridge=recipe.author.fridge))).count())
                          for recipe in Recipe.objects.select_related('author', 'author__fridge')]
                sorted_list = [x[0] for x in result.sort(
                    key=lambda x: -x[1])] if not len(result) else []
                print(sorted_list, " [sorted by ingredient]")
            else:
                # Sort by most recent, most popular button
                recipe_collection = cache.get(
                    'recipes_' + sort_condition + "_" + food_category)
                if not recipe_collection:
                    sorted_list = Recipe.objects.all().order_by(sort_condition, '-created_at')
                else:
                    return JsonResponse(recipe_collection[str_idx: end_idx], safe=False)

        # User Search the Recipe List with query and food category
        else:
            # Sort By Query
            filtered_list = Recipe.objects.select_related('author').filter(Q(recipe_content__icontains=query) | Q(
                food_name__icontains=query) | Q(food_category__icontains=query) | Q(ingredients__ingredient__icontains=query))
            # Sort By Food Category
            sorted_list = filtered_list.order_by(sort_condition).filter(
                food_category=food_category) if food_category != '전체' else sorted_list
            print("[Sorted_list by user Ingredient] ", sorted_list)

        recipe_collection = [{
            "id": recipe.id,
            "authorId": recipe.author.id,
            "author": recipe.author.username,
            "foodName": recipe.food_name,
            "cookTime": recipe.cook_time,
            "recipeContent": recipe.recipe_content,
            "foodImagePaths": list(recipe.images.values('id', 'file_path')),
            "recipeLike": recipe.likes.count(),
            "userLike": recipe.likes.filter(user_id=user.id).count(),
            "createdAt": recipe.created_at.strftime("%Y.%m.%d"),
            "foodCategory": recipe.food_category,
            "ingredients": list(recipe.ingredients.values('id', 'ingredient', 'quantity')),
        } for recipe in sorted_list]

        cache.set(recipe_collection, 'recipes_' +
                  sort_condition + "_" + food_category + '_')

        return JsonResponse({"recipeList": recipe_collection[str_idx: end_idx], "recipeCount": len(recipe_collection)}, safe=False)

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


@api_view(['GET', 'POST'])
@login_required
@transaction.atomic
def today_recipe_list(request):
    """ get Today recipe list """
    today = timezone.now().strftime('%Y-%m-%d')
    yesterday = timezone.now()-timezone.timedelta(days=1)
    today_recipe = cache.get('today_recipe_'+str(today))
    user_id = request.user.id
    if not today_recipe:
        recipe_list = Recipe.objects.filter(
            created_at__gte=yesterday).order_by('like_users')
        if recipe_list == [] and Recipe.objects.all():
            recipe_list = Recipe.objects.all().order_by('like_users', '-created_at')

        today_recipe = [{
            "id": recipe.id,
            "authorId": recipe.author.id,
            "author": recipe.author.username,
            "foodName": recipe.food_name,
            "cookTime": recipe.cook_time,
            "recipeContent": recipe.recipe_content,
            "foodImagePaths": list(Image.objects.filter(recipe_id=recipe.id).values()),
            "recipeLike": recipe.likes.count(),
            "userLike": recipe.likes.filter(user_id=user_id).count(),
            "createdAt": recipe.created_at.strftime("%Y.%m.%d"),
            "foodCategory": recipe.food_category,
            "ingredients": list(recipe.ingredients.values('id', 'ingredient', 'quantity')),
        } for recipe in list(recipe_list)[:4]]
        cache.set(today_recipe, 'today_recipe_'+str(today))

    return JsonResponse({"recipeList": today_recipe, "recipeCount": 4}, safe=False)


@api_view(['GET', 'DELETE'])
@login_required
def recipe_info(request, id):
    """get recipe of given id"""
    user_id = request.user.id
    recipe_reponse = cache.get('recipe_' + str(id) + "_" + user_id)

    if not recipe_response:
        recipe = Recipe.objects.get(id=id)
        recipe_response = {
            "id": recipe.id,
            "authorId": recipe.author.id,
            "author": recipe.author.username,
            "foodName": recipe.food_name,
            "cookTime": recipe.cook_time,
            "recipeContent": recipe.recipe_content,
            "foodImagePaths": list(Image.objects.filter(recipe_id=recipe.id).values()),
            "recipeLike": recipe.likes.count(),
            "userLike": recipe.likes.filter(user_id=user_id).count(),
            "createdAt": recipe.created_at.strftime("%Y.%m.%d"),
            "foodCategory": recipe.food_category,
            "ingredients": list(recipe.ingredients.values('id', 'ingredient', 'quantity')),
        }
        cache.set(recipe_response, 'recipe_' + str(id) + "_" + user_id)
    if request.method == 'GET':
        return JsonResponse(data=recipe_response, status=201)
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
