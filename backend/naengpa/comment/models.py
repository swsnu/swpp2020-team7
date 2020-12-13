"""models for comment"""
from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.core.cache import cache
from recipe.models import Recipe
from user.models import Notification

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
    def total_likes(self):
        return self.likes.count(),

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

    def save(self, *args, **kwargs):
        cache.delete(f'recipe:{self.recipe.id}')
        if not self.pk:
            self.author.naengpa_score += 10
            self.author.save(update_fields=['naengpa_score'])
            Notification.objects.create(
                recipient=self.recipe.author,
                content=f"{self.author.name}님이 '{self.recipe.food_name}' 레시피에 댓글을 달았어요"
            )
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        cache.delete(f'recipe:{self.recipe.id}')
        self.author.naengpa_score -= 10
        self.author.save(update_fields=['naengpa_score'])
        super().delete(*args, **kwargs)


class CommentLike(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="comment_likes")
    comment = models.ForeignKey(
        Comment, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ('user', 'comment')

    def __str__(self):
        return f'[{self.id}] {self.user} likes {self.comment}'

    def save(self, *args, **kwargs):
        cache.delete(f'recipe:{self.comment.recipe.id}')
        if not self.pk:
            Notification.objects.create(
                recipient=self.comment.author,
                content=f"{self.user.name}님이 회원님이 작성하신 '{self.comment.recipe.food_name}' 레시피 댓글에 좋아요를 눌렀어요"
            )
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        cache.delete(f'recipe:{self.comment.recipe.id}')
        super().delete(*args, **kwargs)
