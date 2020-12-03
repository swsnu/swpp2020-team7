"""urls for ingredient"""
from django.urls import path
from ingredient import views

urlpatterns = [
    path('', views.ingredient_list, name='ingredient_list'),
]
