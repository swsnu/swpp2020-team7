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

    @property
    def created_string(self):
        time = timezone.now() - self.created_at
        if time < timezone.timedelta(minutes=1):
            return '방금 전'
        elif time < timezone.timedelta(hours=1):
            return str(int(time.seconds / 60)) + '분 전'
        elif time < timezone.timedelta(days=1):
            return str(int(time.seconds / 3600)) + '시간 전'
        elif time < timezone.timedelta(days=7):
            time = timezone.datetime.now(
                tz=timezone.utc).date() - self.created_at
            return str(time.days) + '일 전'
        else:
            return False

    def __str__(self):
        return f'[{self.id}] {self.content} in {self.recipe} by {self.author}'
