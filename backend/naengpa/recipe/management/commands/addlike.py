import random
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction
from recipe.models import Recipe, RecipeLike

User = get_user_model()


class Command(BaseCommand):
    """makes up Region database"""

    def handle(self, *args, **kwargs):
        """makes up RecipeLike db table with gu-dong data in Seoul"""
        user_id_list = User.objects.values_list('id', flat=True)
        recipe_id_list = Recipe.objects.values_list('id', flat=True)

        total_like = 1
        for _ in range(50):
            random_user_id = random.choice(user_id_list)
            random_recipe_id = random.choice(recipe_id_list)

            try:
                RecipeLike.objects.get(
                    user_id=random_user_id, recipe_id=random_recipe_id)
                print("[skip]")
            except RecipeLike.DoesNotExist:
                with transaction.atomic():
                    print("{}th like created".format(total_like))
                    RecipeLike.objects.create(
                        user_id=random_user_id, recipe_id=random_recipe_id)
                    random_user = User.objects.get(id=random_user_id)
                    random_user.naengpa_score += 10
                    random_user.save(update_fields=['naengpa_score'])
                    total_like += 1
