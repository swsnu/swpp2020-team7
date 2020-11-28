"""views for ingredient"""
from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from konlpy.tag import Kkma
from ingredient.models import Ingredient
from collections import OrderedDict
import json
import requests


# @ensure_csrf_cookie
def extract_foodcategory(request, food_images):
    print(food_images)
    # Parameters
    img = food_images[0]
    '''
    client = Client(enforce_csrf_checks=True)
    response = client.get('/api/login/', content_type='application/json')
    csrftoken = response.cookies['csrftoken'].value
    headers = {'Authorization': 'Bearer ' + csrftoken}
    '''
    '''
    csrftoken = django.middleware.csrf.get_token(request)
    headers = {'Authorization': 'Bearer ' + csrftoken}
    '''
    # api_user_token = <'replace-with-your-api-user-token'>
    #headers = {'Authorization': 'Bearer ' + api_user_token}

    # Food Dish/Groups Detection
    url = 'https://api.logmeal.es/v2/recognition/dish'
    resp = requests.post(url,
                         files={'image': img},
                         headers=None)
    print(resp.json())  # display groups only
    return "밥류"


def extract_ingredients(request, recipe_info):
    recipe_content = recipe_info['recipeContent']
    kkma = Kkma()
    noun_list = kkma.nouns(recipe_content)
    print("추출된 명사 리스트: ", noun_list)
    ingredient_dict = OrderedDict()

    for noun in noun_list:
        try:
            # extract nouns only and compare with the ingredient list
            ingredients = Ingredient.objects.filter(name=noun)
            for item in ingredients:
                ingredient_dict[item.name] = ingredient_dict[item.name] + \
                    1 if item.name in ingredient_dict.keys() else 1
        except Ingredient.DoesNotExist:
            pass
    print(ingredient_dict)

    context = [
        {"ingredient": ingredient, "quantity": ""} for ingredient in ingredient_dict.keys()
    ]
    print(context, "context")
    return context


@ensure_csrf_cookie
def extract_ml_feature(request):
    """/api/extract/ extract ml features"""
    if request.method == 'POST':
        ''' POST /api/recipes/ post new recipe '''
        if not request.user.is_authenticated:
            return HttpResponse(status=401)

        recipe_info = eval(request.POST.dict().get('recipe', ''))
        food_images = request.FILES.getlist('image')
        food_category = extract_foodcategory(request, food_images)
        ingredients = extract_ingredients(request, recipe_info)
        return_data = {'foodCategory': food_category,
                       'ingredients': ingredients}

        return JsonResponse(return_data, safe=False)
    else:
        return HttpResponseNotAllowed(['POST'])
