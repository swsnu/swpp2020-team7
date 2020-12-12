"""models for recipe"""
from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.core.cache import cache
from ingredient.models import Ingredient
from food_category.models import FoodCategory
from user.models import Notification

User = get_user_model()


class Recipe(models.Model):
    """Recipe model"""
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="recipes")
    food_name = models.CharField(max_length=50)
    food_category = models.ForeignKey(FoodCategory, on_delete=models.CASCADE)
    cook_time = models.PositiveIntegerField(default=0)
    recipe_content = models.TextField(blank=True)
    views = models.PositiveIntegerField(default=0)
    like_users = models.ManyToManyField(
        User, blank=True, related_name='liked_recipe', through='RecipeLike')
    created_at = models.DateTimeField(default=timezone.now, db_index=True)
    updated_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'[{self.id}] {self.food_name} by {self.author}'

    def save(self, *args, **kwargs):
        cache.delete_many(['recipes', 'today_recipes', f'recipe:{self.id}'])
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        cache.delete_many(['recipes', 'today_recipes', f'recipe:{self.id}'])
        super().delete(*args, **kwargs)


class Image(models.Model):
    """Image model for Recipe"""
    recipe = models.ForeignKey(
        Recipe, on_delete=models.CASCADE, related_name="images")
    file_path = models.URLField(max_length=250, unique=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'[{self.id}] of {self.recipe}'

    def save(self, *args, **kwargs):
        cache.delete_many(['recipes', 'today_recipes',
                           f'recipe:{self.recipe.id}'])
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        cache.delete_many(['recipes', 'today_recipes',
                           f'recipe:{self.recipe.id}'])
        super().delete(*args, **kwargs)


class RecipeIngredient(models.Model):
    """Ingredient model for Recipe"""
    recipe = models.ForeignKey(
        Recipe, on_delete=models.CASCADE, related_name="ingredients")
    ingredient = models.ForeignKey(
        Ingredient, on_delete=models.CASCADE, related_name="recipes")
    quantity = models.CharField(max_length=50, null=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'[{self.id}] of {self.recipe}'

    def save(self, *args, **kwargs):
        cache.delete_many(['recipes', 'today_recipes',
                           f'recipe:{self.recipe.id}'])
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        cache.delete_many(['recipes', 'today_recipes',
                           f'recipe:{self.recipe.id}'])
        super().delete(*args, **kwargs)


class RecipeLike(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="recipe_likes")
    recipe = models.ForeignKey(
        Recipe, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ('user', 'recipe')

    def __str__(self):
        return f'[{self.id}] {self.user} likes {self.recipe}'

    def save(self, *args, **kwargs):
        cache.delete_many(['recipes', 'today_recipes',
                           f'recipe:{self.recipe.id}'])
        if not self.pk:
            self.user.naengpa_score += 10
            self.user.save(update_fields=['naengpa_score'])
            Notification.objects.create(
                recipient=self.recipe.author,
                content=f"{self.user.name}님이 '{self.recipe.food_name}' 레시피에 좋아요를 눌렀어요"
            )
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        cache.delete_many(['recipes', 'today_recipes',
                           f'recipe:{self.recipe.id}'])
        self.user.naengpa_score -= 10
        self.user.save(update_fields=['naengpa_score'])
        super().delete(*args, **kwargs)
