"""models for user"""
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

# pylint: disable-msg=R0201
# pylint: disable=no-self-use


class Profile(models.Model):
    ''' Profile model '''
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=30)
    date_of_birth = models.CharField(max_length=30)

    @receiver(post_save, sender=User)
    def create_user_profile(sender, instance, created, **kwargs):
        ''' create user profile '''
        if created:
            Profile.objects.create(user=instance)

    @receiver(post_save, sender=User)
    def save_user_profile(ender, instance, **kwargs):
        ''' save user profile '''
        instance.profile.save()
