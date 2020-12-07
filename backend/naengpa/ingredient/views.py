"""views for ingredient"""
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.core.cache import cache
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view
from .models import IngredientCategory


@ensure_csrf_cookie
@api_view(['GET'])
@login_required
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
