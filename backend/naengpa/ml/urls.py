"""urls for ingredient"""
from django.urls import path
from ml import views

urlpatterns = [
    path('', views.extract_ml_feature, name='extract_ml_feature'),
]
