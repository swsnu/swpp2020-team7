# Generated by Django 3.1.2 on 2020-12-10 02:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='naengpa_score',
            field=models.IntegerField(db_index=True, default=0),
        ),
    ]