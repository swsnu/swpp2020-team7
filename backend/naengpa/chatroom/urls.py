"""urls for chatroom"""
from django.urls import path
from . import views

urlpatterns = [
    path('', views.chatroom_list, name='chatroom_list'),
    path('<int:id>/',
         views.chatroom, name='chatroom'),
]
