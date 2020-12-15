"""views for ingredient"""
from django.http import JsonResponse
from django.core.cache import cache
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view
from utils.auth import login_required_401
from .models import IngredientCategory, Ingredient


@ensure_csrf_cookie
@api_view(['GET'])
def ingredient_list(request):
    """/api/ingredients/ Get article list"""
    if request.method == 'GET':
        ingredient_collection = cache.get('ingredients')
        if not ingredient_collection:
            ingredient_collection = {category.name: [
                item for item in category.ingredients.all().values('id', 'name')]
                for category in IngredientCategory.objects.all()}
            cache.set('ingredients', ingredient_collection)
        return JsonResponse(ingredient_collection, safe=False)


@ensure_csrf_cookie
@api_view(['GET'])
def ingredient_names(request):
    if request.method == 'GET':
        ingredient_collection = cache.get('ingredient_names')
        if not ingredient_collection:
            ingredient_collection = [
                {
                    'id': ingredient.id,
                    'name': ingredient.name
                } for ingredient in Ingredient.objects.all()]
            cache.set('ingredient_names', ingredient_collection)
        return JsonResponse(ingredient_collection, safe=False)
