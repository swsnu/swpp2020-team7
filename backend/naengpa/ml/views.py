"""views for ingredient"""
from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from konlpy.tag import Kkma
from ingredient.models import Ingredient
from collections import OrderedDict


def extract_foodcategory(request, food_images):
    print(food_images)
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
            ingredient = Ingredient.objects.get(name__contains=noun)
            ingredient_dict[ingredient.name] = ingredient_dict[ingredient.name] + \
                1 if ingredient.name in ingredient_dict.keys() else 1
        except Ingredient.DoesNotExist:
            pass
    print(ingredient_dict)
    return list(ingredient_dict.keys())


def extract_hashtag(request, recipe_info):
    return ["혼밥", "술안주"]


@ensure_csrf_cookie
def extract_ml_feature(request):
    """/api/extract/ extract ml features"""
    if request.method == 'POST':
        ''' POST /api/recipes/ post new recipe '''
        if not request.user.is_authenticated:
            return HttpResponse(status=401)

        recipe_info = eval(request.POST.dict()['recipe'])
        food_images = request.FILES.getlist('image')
        food_category = extract_foodcategory(request, food_images)
        ingredients = extract_ingredients(request, recipe_info)
        hashtags = extract_hashtag(request, recipe_info)
        return_data = {'foodCategory': food_category,
                       'ingredients': ingredients, 'hashtags': hashtags}

        return JsonResponse(return_data, safe=False)
    else:
        return HttpResponseNotAllowed(['POST'])
