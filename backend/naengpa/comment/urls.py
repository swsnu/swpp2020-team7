"""urls for comment"""
from django.urls import path
from . import views

urlpatterns = [
    path('', views.comment_list, name='comment_list'),
    path('<int:cid>/', views.comment_info, name='comment_info'),
]
