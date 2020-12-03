"""views for ingredient"""
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from django.core.cache import cache
from .models import IngredientCategory


@ensure_csrf_cookie
def ingredient_list(request):
    """/api/ingredients/ Get article list"""
    if request.method == 'GET':
        ingredient_collection = cache.get('ingredients')
        if not ingredient_collection:
            if not request.user.is_authenticated:
                return HttpResponse(status=401)
            ingredient_collection = {category.name: [
                item for item in category.ingredients.all().values('id', 'name')]
                for category in IngredientCategory.objects.all()}
            cache.set('ingredients', ingredient_collection)
        return JsonResponse(ingredient_collection, safe=False)
    else:
        return HttpResponseNotAllowed(['GET'])
