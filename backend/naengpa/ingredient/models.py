"""models for ingredient"""
from django.db import models


class Ingredient(models.Model):
    """Ingredient model"""
    name = models.CharField(max_length=50, unique=True)
    category = models.CharField(max_length=50)

    def __str__(self):
        return f'[{self.id}] {self.category}: {self.name}'
