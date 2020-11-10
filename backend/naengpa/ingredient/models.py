"""models for ingredient"""
from django.db import models


class IngredientCategory(models.Model):
    """IngredientCategory model"""
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return f'{self.name}'


class Ingredient(models.Model):
    """Ingredient model"""
    name = models.CharField(max_length=50, unique=True)
    category = models.ForeignKey(
        IngredientCategory, on_delete=models.CASCADE, related_name="ingredients")

    def __str__(self):
        return f'[{self.id}] {self.category}: {self.name}'
