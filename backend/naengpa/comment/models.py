"""models for comment"""
from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.core.cache import cache
from recipe.models import Recipe

User = get_user_model()


class Comment(models.Model):
    """Comment model"""
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='comments')
    recipe = models.ForeignKey(
        Recipe, on_delete=models.CASCADE, related_name='comments')
    content = models.CharField(max_length=300)
    created_at = models.DateTimeField(default=timezone.now, db_index=True)

    def __str__(self):
        return f'[{self.id}] {self.content} in {self.recipe} by {self.author}'
