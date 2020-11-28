"""views for recipe"""
import json
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest, HttpResponseForbidden,  HttpResponseNotFound, HttpResponseNotAllowed
from django.views.decorators.csrf import ensure_csrf_cookie
from naengpa.settings import S3_URL, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_STORAGE_BUCKET_NAME, AWS_S3_REGION_NAME
import boto3
from .models import Recipe, Image, RecipeIngredient
from ingredient.models import Ingredient
from food_category.models import FoodCategory
from datetime import datetime
from django.core import serializers
from django.db.models import Q


@ensure_csrf_cookie
def recipe_list(request):
    """get recipe list"""
    if request.method != 'GET' and request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])
    query = request.GET.get('value', "")
    sorted_list = Recipe.objects.all().select_related('author').filter(
        Q(recipe_content__contains=query) | Q(food_name__contains=query)).order_by('-created_at') if query != "" else \
        Recipe.objects.all().select_related(
            'author').order_by('-created_at')

    recipe_collection = [{
        "id": recipe.id,
        "authorId": recipe.author.id,
        "author": recipe.author.username,
        "foodName": recipe.food_name,
        "cookTime": recipe.cook_time,
        "recipeContent": recipe.recipe_content,
        "foodImages": list(Image.objects.filter(recipe_id=recipe.id).values()),
        "recipeLike": 0,
        "createdAt": recipe.created_at.strftime("%Y.%m.%d"),
        "foodCategory": recipe.food_category,
        "ingredients": list(RecipeIngredient.objects.filter(recipe_id=recipe.id).values()),
    } for recipe in sorted_list] if len(sorted_list) != 0 else []

    if request.user.is_authenticated:
        if request.method == 'GET':
            ''' GET /api/recipes/ get recipe list '''
            return JsonResponse(recipe_collection, safe=False)

        else:
            ''' POST /api/recipes/ post new recipe '''
            req_data = eval(request.POST.dict().get('recipe', ''))
            food_images = request.FILES.getlist('image')
            food_name = req_data['foodName']
            cook_time = req_data['cookTime']
            recipe_content = req_data['recipeContent']
            food_category = req_data['foodCategory']
            ingredients = req_data['ingredients']

            recipe = Recipe.objects.create(
                author_id=request.user.id,
                food_name=food_name,
                cook_time=cook_time,
                recipe_content=recipe_content,
                food_category=food_category,
            )

            session = boto3.Session(
                aws_access_key_id=AWS_ACCESS_KEY_ID,
                aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
                region_name=AWS_S3_REGION_NAME
            )
            s3 = session.resource('s3')

            for item in food_images:
                now = datetime.now()
                img_object = s3.Bucket(AWS_STORAGE_BUCKET_NAME).put_object(
                    Key="recipe/"+str(recipe.id)+"/" +
                    str(request.user.id)+"-"+str(now),
                    Body=item

                )
                recipe_image = S3_URL+"recipe/" + \
                    str(recipe.id)+"/"+str(request.user.id)+"-"+str(now)

                Image.objects.create(
                    file_path=recipe_image, recipe_id=recipe.id)

            return JsonResponse(data={
                "id": recipe.id,
                "authorId": recipe.author.id,
                "author": recipe.author.username,
                "foodName": food_name,
                "cookTime": cook_time,
                "foodImages": list(Image.objects.filter(recipe_id=recipe.id).values()),
                "recipeContent": recipe_content,
                "recipeLike": 0,
                "createdAt": recipe.created_at,
                "foodCategory": recipe.food_category,
                "ingredients": list(RecipeIngredient.objects.filter(recipe_id=recipe.id).values()),
            }, status=201)
    else:
        return HttpResponse(status=401)


def recipe_info(request, id):
    """get recipe of given id"""
    return HttpResponse(status=405)
