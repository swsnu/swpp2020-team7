"""models for user"""
import uuid
from django.contrib.auth.models import AbstractUser
from django.contrib.gis.db import models
from django.contrib.gis.geos import Point
from django.core.cache import cache
from ingredient.models import Ingredient


class Region(models.Model):
    ''' Region model '''
    si_name = models.CharField(max_length=10)
    gu_name = models.CharField(max_length=20)
    dong_name = models.CharField(max_length=20)
    location = models.PointField(
        geography=True, default=Point(0.0, 0.0))

    @property
    def name(self):
        return "{} {} {}".format(self.si_name, self.gu_name, self.dong_name)

    @property
    def latitude(self):
        return self.location.y

    @property
    def longitude(self):
        return self.location.x

    class Meta:
        unique_together = ('si_name', 'gu_name', 'dong_name',)

    def __str__(self):
        return f'[{self.id}] {self.name}: {self.location}'

    def save(self, *args, **kwargs):
        cache.delete('users')
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        cache.delete('users')
        super().save(*args, **kwargs)


class User(AbstractUser):
    ''' User model '''
    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=30)
    date_of_birth = models.CharField(max_length=30)
    naengpa_score = models.IntegerField(default=0)
    region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True)
    region_range = models.IntegerField(default=0)

    def __str__(self):
        return f'[{self.id}] {self.name}'

    def save(self, *args, **kwargs):
        cache.delete('users')
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        cache.delete('users')
        super().save(*args, **kwargs)


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
