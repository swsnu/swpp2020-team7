"""views for ingredient"""
from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from konlpy.tag import Kkma
from naengpa.settings.env import LOGMEAL_TOKEN
from ingredient.models import Ingredient
from collections import OrderedDict
import json
import requests
from io import BytesIO


# def convertToJpeg(im):
#     with BytesIO() as f:
#         im.save(f, format='JPEG')
#         return f.getvalue()

# @ensure_csrf_cookie
def extract_foodcategory(request, food_images):
    print(food_images)
    # Parameters
    img = food_images[0]
    user_token = LOGMEAL_TOKEN
    headers = {'Authorization': 'Bearer ' + user_token}

    # im1 = Image.open(r'path where the PNG is stored\file name.png')
    # im1.save(r'path where the JPG will be stored\new file name.jpg')

    # Food Dish/Groups Detection
    url = 'https://api.logmeal.es/v2/recognition/dish'
    resp = requests.post(url,
                         files={'image': img},
                         headers=headers)
    # print(resp.json()['foodFamily'])  # display groups only
    response = resp.text.split('"')
    print(response[7])
    food_category_result = {'meat': '고기류',
                            'dessert': '디저트류', 'dairy': '유제품류', 'seafood': '해물류', 'rice': '밥류', 'fruit': '과일류', 'noodles/pasta': '면류', 'vegetables': '채소류', 'fish': '생선류', 'bread': '빵류', 'fried': '튀김류', 'egg': '계란/알류', 'soup': '수프/국/찌개류', '': '기타'}
    if response[7] in food_category_result.keys():
        return food_category_result[response[7]]
    else:
        return "기타"


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
