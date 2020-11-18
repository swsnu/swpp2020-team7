"""models for recipe"""
from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model

User = get_user_model()


class Recipe(models.Model):
    """Recipe model"""
    author = models.ForeignKey(User, null=True, on_delete=models.CASCADE)
    food_name = models.CharField(max_length=50)
    food_category = models.CharField(max_length=50)
    cook_time = models.CharField(max_length=50)
    ingredients = models.TextField(blank=True)
    recipe_content = models.TextField(blank=True)

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)


class Image(models.Model):
    """Image model for Recipe"""
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    file_path = models.TextField(null=True)
