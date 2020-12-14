# Generated by Django 3.1.2 on 2020-12-14 17:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0004_auto_20201213_1651'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='category',
            field=models.CharField(max_length=16, null=True),
        ),
        migrations.AddField(
            model_name='notification',
            name='target_id',
            field=models.PositiveIntegerField(null=True),
        ),
    ]
