"""models for chatroom"""
from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model
from user.models import Notification

User = get_user_model()


class ChatRoom(models.Model):
    chat_members = models.ManyToManyField(
        User, blank=True, related_name="chatroom", through="ChatMember")
    updated_at = models.DateTimeField(default=timezone.now)

    @property
    def updated_string(self):
        time = timezone.now() - self.updated_at
        if time < timezone.timedelta(minutes=1):
            return '방금 전'
        elif time < timezone.timedelta(hours=1):
            return str(int(time.seconds / 60)) + '분 전'
        elif time < timezone.timedelta(days=1):
            return str(int(time.seconds / 3600)) + '시간 전'
        elif time < timezone.timedelta(days=7):
            time = timezone.now().date() - self.updated_at.date()
            return str(time.days) + '일 전'
        else:
            time = timezone.now().date() - self.updated_at.date()
            return str(time.month) + '개월 전'

    def __str__(self):
        return f'[{self.id}] by {self.chat_members} - {self.updated_at}]'

    @property
    def updated_string(self):
        time = timezone.now() - self.updated_at
        if time < timezone.timedelta(minutes=1):
            return '방금 전'
        elif time < timezone.timedelta(hours=1):
            return str(int(time.seconds / 60)) + '분 전'
        elif time < timezone.timedelta(days=1):
            return str(int(time.seconds / 3600)) + '시간 전'
        elif time < timezone.timedelta(days=7):
            time = timezone.datetime.now(
                tz=timezone.utc).date() - self.updated_at
            return str(time.days) + '일 전'
        else:
            return False


class ChatMember(models.Model):
    member = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="chat_member")
    chatroom = models.ForeignKey(
        ChatRoom, on_delete=models.CASCADE, related_name='chat_member')
    notice = models.IntegerField(default=0, verbose_name='chat_count')

    def __str__(self):
        return f'[{self.id}] by {self.member.username} - chatroom {self.chatroom.id}[notice-{self.notice}]'


class Message(models.Model):
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="message")
    chatroom = models.ForeignKey(
        ChatRoom, on_delete=models.CASCADE)
    content = models.CharField(max_length=256)
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
            time = timezone.now().date() - self.created_at.date()
            return str(time.days) + '일 전'
        else:
            time = timezone.now().date() - self.created_at.date()
            return str(time.month) + '개월 전'

    def __str__(self):
        return f'[message-{self.id}] by {self.author}'

    def save(self, *args, **kwargs):
        if not self.pk:
            Notification.objects.create(
                recipient=self.chatroom.chat_members.exclude(id=self.author.id)[
                    0],
                content=f"{self.author.name}님이 '{self.content[:30]}...' 메시지를 보냈어요"
            )
        super().save(*args, **kwargs)
