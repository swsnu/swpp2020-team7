"""models for chatroom"""
from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model

User = get_user_model()


class ChatRoom(models.Model):
    chat_members = models.ManyToManyField(
        User, blank=True, related_name="chatroom", through="ChatMember")
    updated_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'[{self.id}] by {self.chat_members} - {self.updated_at}]'


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

    def __str__(self):
        return f'[message-{self.id}] by {self.author}'
