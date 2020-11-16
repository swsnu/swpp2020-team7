"""admin for ingredient"""
from django.contrib import admin
from .models import Ingredient, IngredientCategory

# Register your models here.
admin.site.register(IngredientCategory, Ingredient)
