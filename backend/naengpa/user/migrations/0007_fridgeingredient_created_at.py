# Generated by Django 3.1.2 on 2020-12-06 14:46

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0006_user_region_range'),
    ]

    operations = [
        migrations.AddField(
            model_name='fridgeingredient',
            name='created_at',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
