"""models for foodCategory"""
from django.db import models


class FoodCategory(models.Model):
    """FoodCategory model"""
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return f'{self.name}'


class Food(models.Model):
    """Food model"""
    name = models.CharField(max_length=50, unique=True)
    category = models.ForeignKey(
        FoodCategory, on_delete=models.CASCADE, related_name="foods")

    def __str__(self):
        return f'[{self.id}] {self.category}: {self.name}'
