"""models for article"""
from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.core.cache import cache
from ingredient.models import Ingredient

User = get_user_model()


class Article(models.Model):
    """Article model"""
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    content = models.TextField()
    item = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    price = models.PositiveIntegerField(default=0)
    views = models.PositiveIntegerField(default=0)
    is_for_sale = models.BooleanField(default=False)
    is_for_exchange = models.BooleanField(default=False)
    is_for_share = models.BooleanField(default=False)
    done = models.BooleanField(default=False)

    created_at = models.DateTimeField(default=timezone.now, db_index=True)
    updated_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'[{self.id}] {self.title} by {self.author}'

    def save(self, *args, **kwargs):
        cache.delete('articles')
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        cache.delete('articles')
        super().delete(*args, **kwargs)


class Image(models.Model):
    """Image model for Article"""
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    article = models.ForeignKey(
        Article, on_delete=models.CASCADE, related_name="images")
    file_path = models.URLField(max_length=250, null=True, unique=True)

    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'[{self.id}] of {self.article}'

    def save(self, *args, **kwargs):
        cache.delete('articles')
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        cache.delete('articles')
        super().delete(*args, **kwargs)
