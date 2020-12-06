"""models for foodCategory"""
from django.db import models


class FoodCategory(models.Model):
    """FoodCategory model"""
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return f'{self.name}'
