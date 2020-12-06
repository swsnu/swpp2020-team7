"""models for ingredient"""
from django.db import models
from django.core.cache import cache


class IngredientCategory(models.Model):
    """IngredientCategory model"""
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return f'{self.name}'

    def save(self, *args, **kwargs):
        cache.delete('ingredients')
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        cache.delete('ingredients')
        super().save(*args, **kwargs)


class Ingredient(models.Model):
    """Ingredient model"""
    name = models.CharField(max_length=50, unique=True)
    category = models.ForeignKey(
        IngredientCategory, on_delete=models.CASCADE, related_name="ingredients")

    def __str__(self):
        return f'[{self.id}] {self.category}: {self.name}'

    def save(self, *args, **kwargs):
        cache.delete('ingredients')
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        cache.delete('ingredients')
        super().save(*args, **kwargs)
