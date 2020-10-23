from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.user_list, name='user_list'),
    path('users/<int:id>/', views.user, name='login'),
    path('users/<int:id>/fridge/', views.fridge, name='fridge'),
]