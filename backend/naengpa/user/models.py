"""models for user"""
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Profile(models.Model):
    ''' Profile model '''
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=30)
    date_of_birth = models.CharField(max_length=30)

    @receiver(post_save, sender=User)
    def create_user_profile(self, instance, created):
        ''' create user profile '''
        if created:
            Profile.objects.create(user=instance)

    @receiver(post_save, sender=User)
    def save_user_profile(self, instance):
        ''' save user profile '''
        instance.profile.save()
