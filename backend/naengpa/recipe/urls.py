"""urls for recipe"""
from django.urls import path
from . import views

urlpatterns = [
    path('', views.recipe_list, name='recipe_list'),
    path('<int:id>/', views.recipe_info, name='recipe'),
]
