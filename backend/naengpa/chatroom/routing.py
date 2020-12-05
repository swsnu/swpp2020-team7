from django.conf.urls import url
from . import consumers

websocket_urlpatterns = [
    url('ws/chatrooms/<int:chatroom_id>/', consumers.ChatConsumer),
]
