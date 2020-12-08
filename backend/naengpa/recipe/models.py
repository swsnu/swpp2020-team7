"""models for recipe"""
from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.core.cache import cache
from ingredient.models import Ingredient
from food_category.models import FoodCategory
User = get_user_model()


class Recipe(models.Model):
    """Recipe model"""
    author = models.ForeignKey(User, null=True, on_delete=models.CASCADE)
    food_name = models.CharField(max_length=50)
    food_category = models.CharField(max_length=50)
    cook_time = models.CharField(max_length=50)
    recipe_content = models.TextField(blank=True)
    views = models.IntegerField(default=0)
    like_users = models.ManyToManyField(
        User, blank=True, related_name='liked_recipe', through='RecipeLike')
    created_at = models.DateTimeField(default=timezone.now, db_index=True)
    updated_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'[{self.id}] {self.food_name} by {self.author}'

    def save(self, *args, **kwargs):
        cache.delete_many(['recipes', 'today_recipes'])
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        cache.delete_many(['recipes', 'today_recipes'])
        super().save(*args, **kwargs)


class Image(models.Model):
    """Image model for Recipe"""
    recipe = models.ForeignKey(
        Recipe, on_delete=models.CASCADE, null=True, related_name="images")
    file_path = models.URLField(max_length=250, null=True, unique=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'[{self.id}] of {self.recipe}'

    def save(self, *args, **kwargs):
        cache.delete_many(['recipes', 'today_recipes'])
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        cache.delete_many(['recipes', 'today_recipes'])
        super().save(*args, **kwargs)


class RecipeIngredient(models.Model):
    """Ingredient model for Recipe"""
    recipe = models.ForeignKey(
        Recipe, on_delete=models.CASCADE, null=True, related_name="ingredients")
    ingredient = models.CharField(max_length=50, null=True)
    quantity = models.CharField(max_length=50)

    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'[{self.id}] of {self.recipe}'

    def save(self, *args, **kwargs):
        cache.delete_many(['recipes', 'today_recipes'])
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        cache.delete_many(['recipes', 'today_recipes'])
        super().save(*args, **kwargs)


class RecipeLike(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="recipe_likes")
    recipe = models.ForeignKey(
        Recipe, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'[{self.id}] of {self.recipe}'

    def save(self, *args, **kwargs):
        cache.delete_many(['recipes', 'today_recipes'])
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        cache.delete_many(['recipes', 'today_recipes'])
        super().save(*args, **kwargs)
