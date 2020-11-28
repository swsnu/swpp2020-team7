# Generated by Django 3.1.2 on 2020-11-28 13:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('recipe', '0002_auto_20201110_1211'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='recipe',
            name='ingredients',
        ),
        migrations.CreateModel(
            name='RecipeIngredient',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, unique=True)),
                ('quantity', models.CharField(max_length=50)),
                ('recipe', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='recipe.recipe')),
            ],
        ),
    ]
