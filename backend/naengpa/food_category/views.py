"""views for food"""
from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from rest_framework.decorators import api_view
from django.core.cache import cache
from django.views.decorators.csrf import ensure_csrf_cookie
from utils.auth import login_required_401
from .models import FoodCategory


@ensure_csrf_cookie
@api_view(['GET'])
@login_required_401
def food_category_list(request):
    """/api/foodcategory/ Get foodcategory list"""
    return_data = cache.get('food_category')
    if not return_data:
        return_data = [{"id": category.id, "name": category.name}
                       for category in FoodCategory.objects.all()]
        cache.set(return_data, 'food_category')
    return JsonResponse(return_data, safe=False)
