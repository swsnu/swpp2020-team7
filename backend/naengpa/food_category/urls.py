"""urls for ingredient"""
from django.urls import path
from food_category import views

urlpatterns = [
    path('', views.food_category_list, name='food_category_list'),
]
