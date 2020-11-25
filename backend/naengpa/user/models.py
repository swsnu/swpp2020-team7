"""models for user"""
from django.contrib.auth.models import AbstractUser
from django.contrib.gis.db import models
from django.contrib.gis.geos import Point
from ingredient.models import Ingredient

import uuid


class Region(models.Model):
    ''' Region model '''
    name = models.CharField(max_length=30, unique=True)
    location = models.PointField(
        geography=True, default=Point(0.0, 0.0), unique=True)


class User(AbstractUser):
    ''' User model '''
    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=30)
    date_of_birth = models.CharField(max_length=30)
    naengpa_score = models.IntegerField(default=0)
    region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True)


class Fridge(models.Model):
    ''' Fridge model '''
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, primary_key=True)
    ingredients = models.ManyToManyField(
        Ingredient,
        through='FridgeIngredient',
        through_fields=('fridge', 'ingredient'),
    )


class FridgeIngredient(models.Model):
    ''' ManyToMany Through model for Fridge-Ingredient '''
    fridge = models.ForeignKey(Fridge, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    is_today_ingredient = models.BooleanField(default=False)
