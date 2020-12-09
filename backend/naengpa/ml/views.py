"""views for ingredient"""
import json
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from rest_framework.decorators import api_view
from utils.auth import login_required_401
from utils.logmeal_utils import extract_foodcategory, InvalidImageFileGiven
from utils.konlpy_utils import extract_ingredients


@ensure_csrf_cookie
@api_view(['POST'])
@login_required_401
def extract_ml_feature(request):
    """/api/extract/ extract ml features"""
    if request.method == 'POST':
        ''' POST /api/recipes/ post new recipe '''
        recipe_info = json.loads(request.POST.get('recipe'))
        recipe_content = recipe_info['content']
        food_images = request.FILES.getlist('image')
        try:
            food_category = extract_foodcategory(food_images)
            ingredients = extract_ingredients(recipe_content)
            return_data = {'foodCategory': food_category,
                           'ingredients': ingredients}
        except InvalidImageFileGiven as err:
            print(err)
            return HttpResponseBadRequest(json.dumps({'code': err.code, 'message': str(err)}))
        return JsonResponse(return_data, safe=False)
