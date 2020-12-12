# Generated by Django 3.1.2 on 2020-12-13 00:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='notification',
            name='title',
        ),
        migrations.AddField(
            model_name='notification',
            name='deleted',
            field=models.BooleanField(db_index=True, default=False),
        ),
    ]
