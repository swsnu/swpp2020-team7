"""models for user"""
import uuid
from django.contrib.auth.models import AbstractUser
from django.contrib.gis.db import models
from django.contrib.gis.geos import Point
from django.core.cache import cache
from ingredient.models import Ingredient
from django.utils import timezone


class Region(models.Model):
    ''' Region model '''
    si_name = models.CharField(max_length=10)
    gu_name = models.CharField(max_length=20)
    dong_name = models.CharField(max_length=20)
    location = models.PointField(
        geography=True, default=Point(0.0, 0.0))

    @property
    def name(self):
        return "{} {}".format(self.gu_name, self.dong_name)

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
        super().delete(*args, **kwargs)


class User(AbstractUser):
    ''' User model '''
    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=30)
    date_of_birth = models.CharField(max_length=30)
    naengpa_score = models.PositiveIntegerField(default=0, db_index=True)
    region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True)
    region_range = models.PositiveIntegerField(default=0)
    profile_image = models.CharField(max_length=250, null=True, unique=True)

    def __str__(self):
        return f'[{self.id}] {self.name}'

    def save(self, *args, **kwargs):
        cache.delete('users')
        cache.delete_many(
            [f'recipe:{id}' for id in self.recipes.values_list('id', flat=True)])
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        cache.delete('users')
        cache.delete_many(
            [f'recipe:{id}' for id in self.recipes.values_list('id', flat=True)])
        super().delete(*args, **kwargs)


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
    created_at = models.DateTimeField(default=timezone.now)


class Notification(models.Model):
    recipient = models.ForeignKey(
        User, related_name="notifications", on_delete=models.CASCADE)
    title = models.CharField(max_length=20)
    content = models.CharField(max_length=50)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'[to {self.recipient}] {self.title}: {self.content}'
