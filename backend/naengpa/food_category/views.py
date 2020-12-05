"""views for food"""
from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view

from .models import FoodCategory, Food


@api_view(['GET'])
@login_required
def food_category_list(request):
    """/api/foodcategories/ Get article list"""
    if request.method == 'GET':
        return_data = {category.name: [
            item for item in category.foods.all().values('id', 'name')]
            for category in FoodCategory.objects.all()}
        return JsonResponse(return_data, safe=False)
