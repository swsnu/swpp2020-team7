# Generated by Django 3.1.2 on 2020-11-27 17:03

import django.contrib.gis.db.models.fields
import django.contrib.gis.geos.point
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0004_auto_20201127_1658'),
    ]

    operations = [
        migrations.AlterField(
            model_name='region',
            name='gu_name',
            field=models.CharField(max_length=20),
        ),
        migrations.AlterField(
            model_name='region',
            name='location',
            field=django.contrib.gis.db.models.fields.PointField(default=django.contrib.gis.geos.point.Point(0.0, 0.0), geography=True, srid=4326),
        ),
        migrations.AlterField(
            model_name='region',
            name='si_name',
            field=models.CharField(max_length=10),
        ),
    ]