"""models for user"""
from django.contrib.auth.models import AbstractUser
from django.db import models

import uuid


class User(AbstractUser):
    ''' User model '''
    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=30)
    date_of_birth = models.CharField(max_length=30)


class Fridge(models.Model):
    ''' Fridge model '''
    user = models.OneToOneField(User, on_delete=models.CASCADE)
