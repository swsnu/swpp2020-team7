"""urls for article"""
from django.urls import path
from . import views

urlpatterns = [
    path('', views.article_list, name='article_list'),
    path('<int:aid>/', views.article_info, name='article_info'),
]
