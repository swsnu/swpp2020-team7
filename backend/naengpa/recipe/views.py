"""views for recipe"""
import json
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest, HttpResponseForbidden,  HttpResponseNotFound, HttpResponseNotAllowed
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import Recipe, Image


@ensure_csrf_cookie
def recipe_list(request):
    """get recipe list"""
    if request.method != 'GET' and request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])

    sorted_list = Recipe.objects.all().order_by('-created_at')
    recipe_collection = [{
        "id": recipe.id,
        "authorId": recipe.author.id,
        "author": recipe.author.username,
        "foodName": recipe.food_name,
        "cookTime": recipe.cook_time,
        "recipeContent": recipe.recipe_content,
        "foodImages": list(Image.objects.filter(recipe_id=recipe.id).values()),
        "recipeLike": 0,
        "createdAt": recipe.created_at.strftime("%Y.%m.%d")
    } for recipe in sorted_list] if len(sorted_list) != 0 else []

    if request.user.is_authenticated:
        if request.method == 'GET':
            ''' GET /api/recipes/ get recipe list '''
            return JsonResponse(recipe_collection, safe=False)

        else:
            ''' POST /api/recipes/ post new recipe '''
            req_data = json.loads(request.body.decode("utf-8"))
            food_name = req_data['foodName']
            cook_time = req_data['cookTime']
            recipe_content = req_data['recipeContent']
            food_images = req_data['foodImages']
            recipe = Recipe.objects.create(
                author=request.user,
                food_name=food_name,
                cook_time=cook_time,
                recipe_content=recipe_content)

            for item in food_images:
                Image.objects.create(
                    file_path=item, recipe_id=recipe.id)

            return JsonResponse(data={
                "id": recipe.id,
                "authorId": recipe.author.id,
                "author": recipe.author.username,
                "foodName": food_name,
                "cookTime": cook_time,
                "recipeContent": recipe_content,
                "foodImages": food_images,
                "recipeLike": 0,
                "createdAt": recipe.created_at,
            }, status=201)

    else:
        return HttpResponse(status=401)


def recipe_info(request, id):
    """get recipe of given id"""
    return HttpResponse(status=405)
