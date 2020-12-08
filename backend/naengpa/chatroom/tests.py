"""test for chatroom"""
import json
from django.contrib.auth import get_user_model
from django.test import TestCase, Client
from user.models import Region
from .models import ChatRoom, ChatMember, Message

User = get_user_model()


class ChatRoomTestCase(TestCase):
    def setUp(self):
        # create a user
        test_region = Region.objects.create(
            si_name='서울시', gu_name='관악구', dong_name='대학동')
        test_user = User.objects.create_user(
            username='test',
            password='test',
            email='test',
            name='테스트',
            date_of_birth='000000',
            region=test_region,
            region_range=1,
        )
        self.test_user2 = User.objects.create_user(
            username='test2',
            password='test',
            email='test2',
            name='테스트',
            date_of_birth='000000',
            region=test_region,
            region_range=1,
        )
        test_user.save()
        self.test_user2.save()

        # create a chatroom
        chatroom = ChatRoom.objects.create()
        ChatMember.objects.create(chatroom=chatroom, member=test_user)
        ChatMember.objects.create(chatroom=chatroom, member=self.test_user2)

    def test_chatroom_list(self):
        # user is not defined
        response = self.client.get('/api/chatrooms/', follow=True)
        self.assertEqual(response.status_code, 401)

        # with authorization
        self.client.login(username='test', password='test')

        # get chatroom list
        response = self.client.get('/api/chatrooms/')
        self.assertEqual(response.status_code, 200)

        # post chatroom
        response = self.client.post(
            '/api/chatrooms/', {'friend_id': self.test_user2.id})
        self.assertEqual(response.status_code, 201)

        # bad request method
        response = self.client.put('/api/chatrooms/')
        self.assertEqual(response.status_code, 405)

    def test_chatroom(self):
        # user is not defined
        response = self.client.get('/api/chatrooms/1/', follow=True)
        self.assertEqual(response.status_code, 401)

        # with authorization
        self.client.login(username='test', password='test')

        # get chatroom
        response = self.client.get('/api/chatrooms/1/')
        self.assertEqual(response.status_code, 200)

        # delete chatroom
        response = self.client.delete('/api/chatrooms/1/')
        self.assertEqual(response.status_code, 204)

        # bad request method
        response = self.client.post('/api/chatrooms/1/')
        self.assertEqual(response.status_code, 405)
