from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
import json


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chatroom_id = self.scope['url_route']['kwargs']['chatroom_id']
        self.chatroom_name = 'chat_%s' % self.chatroom_id

        await self.channel_layer.group_add(
            self.chatroom_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.chatroom_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        await self.channel_layer.group_send(
            self.chatroom_name, {
                'type': 'chat_message',
                'message': message
            }
        )
        self.send(text_data=json.dumps({
            'message': message
        }))

    # async def chat_message(self, evnet):
    #     message = event['message']

    #     await self.send(text_data=json.dumps({
    #         'message': message
    #     }))
