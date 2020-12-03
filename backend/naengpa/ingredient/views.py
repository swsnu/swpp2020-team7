"""views for ingredient"""
from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from .models import IngredientCategory
from django.views.decorators.csrf import ensure_csrf_cookie


@ensure_csrf_cookie
def ingredient_list(request):
    """/api/ingredients/ Get article list"""
    if request.method == 'GET':
        if not request.user.is_authenticated:
            return HttpResponse(status=401)
        return_data = {category.name: [
            item for item in category.ingredients.all().values('id', 'name')]
            for category in IngredientCategory.objects.all()}
        return JsonResponse(return_data, safe=False)
    else:
        return HttpResponseNotAllowed(['GET'])
