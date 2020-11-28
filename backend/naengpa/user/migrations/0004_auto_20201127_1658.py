# Generated by Django 3.1.2 on 2020-11-27 16:58

import django.contrib.gis.db.models.fields
import django.contrib.gis.geos.point
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0003_user_naengpa_score'),
    ]

    operations = [
        migrations.CreateModel(
            name='Region',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('si_name', models.CharField(max_length=10, unique=True)),
                ('gu_name', models.CharField(max_length=20, unique=True)),
                ('dong_name', models.CharField(max_length=20)),
                ('location', django.contrib.gis.db.models.fields.PointField(default=django.contrib.gis.geos.point.Point(0.0, 0.0), geography=True, srid=4326, unique=True)),
            ],
            options={
                'unique_together': {('si_name', 'gu_name', 'dong_name')},
            },
        ),
        migrations.AddField(
            model_name='user',
            name='region',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='user.region'),
        ),
    ]
