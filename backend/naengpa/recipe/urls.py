"""urls for recipe"""
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('', views.recipe_list, name='recipe_list'),
    path('today/', views.today_recipe_list, name='today_recipe_list'),
    path('<int:id>/', views.recipe_info, name='recipe'),
    path('<int:id>/like/', views.recipe_like, name='recipe_like'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
