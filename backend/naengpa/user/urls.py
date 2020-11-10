"""urls for user"""
from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('login/', views.signin, name='login'),
    path('logout/', views.signout, name='logout'),
    path('users/', views.user_list, name='user_list'),
    #path('users/<uuid:id>/', views.user, name='login'),
    path('users/<uuid:id>/fridge/', views.user_fridge, name='user_fridge'),
    path('users/<uuid:user_id>/ingredients/<int:id>/',
         views.user_ingredient, name='user_ingredient'),
]
