"""admin for chatroom"""
import json
from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse, HttpResponseBadRequest, HttpResponseNotFound
from rest_framework.decorators import api_view
from chatroom.models import ChatRoom, ChatMember, Message
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils import timezone
from django.db import transaction
from django.db.models import Q
from utils.auth import login_required_401

User = get_user_model()

LETS_CHAT_MESSAGE = "채팅을 시작해보세요!"


def get_time_format(time_str):
    return time_str.strftime("%y.%m.%d") if time_str.strftime("%y.%m.%d") != timezone.now().strftime("%y.%m.%d") \
        else time_str.strftime("%H:%M")


def get_chatroom_list(request):
    try:
        user = request.user
        chatrooms = ChatRoom.objects.filter(
            chat_members=user).order_by('-updated_at')
    except User.DoesNotExist:
        return HttpResponseNotFound()
    except ChatRoom.DoesNotExist:
        return JsonResponse([], safe=False)

    try:
        chatroom_collection = [{
            "id": chatroom.id,
            "messages": [{
                "content": message.content,
                "author": message.author.username,
                "createdAt": get_time_format(message.created_at),
            } for message in chatroom.message_set.select_related('author')],
            "lastChat": chatroom.message_set.all().last().content if chatroom.message_set.count() != 0 else LETS_CHAT_MESSAGE,
            "member": ChatMember.objects.filter(chatroom_id=chatroom.id).exclude(member_id=user.id).first().member.username,
            "updatedAt": chatroom.updated_string,
            "chatCount": ChatMember.objects.get(Q(chatroom_id=chatroom.id) & Q(member_id=user.id)).notice,
        } for chatroom in chatrooms]
    except Message.DoesNotExist:
        return HttpResponseBadRequest()
    except ChatMember.DoesNotExist:
        return HttpResponseBadRequest()

    return JsonResponse(chatroom_collection, safe=False)


def make_chatroom(request):
    user = request.user
    try:
        friend_id = request.data['friend_id']
        friend = User.objects.get(id=friend_id)
        chatroom = ChatRoom.objects.get(
            Q(chat_members=user) & Q(chat_members=friend))
        chat_user = user.chat_member.get(chatroom_id=chatroom.id)
        chat_user.notice = 0
        chat_user.save()
    except (KeyError, json.decoder.JSONDecodeError):
        return HttpResponseBadRequest()
    except User.DoesNotExist:
        return HttpResponseBadRequest()
    except ChatRoom.DoesNotExist:
        chatroom = ChatRoom.objects.create()
        chatroom.chat_members.add(user, friend)
        chatroom.save()
        pass
    except ChatMember.DoesNotExist:
        return HttpResponseBadRequest()

    messages = chatroom.message_set.select_related(
        'author').all().order_by('created_at')

    return JsonResponse(data={
        "id": chatroom.id,
        "messages": [{
            "content": message.content,
            "author": message.author.username,
            "createdAt": get_time_format(message.created_at),
        } for message in messages],
        "lastChat": messages.last().content if messages.count() != 0 else LETS_CHAT_MESSAGE,
        "member": friend.username,
        "updatedAt":  chatroom.updated_string,
        "chatCount": 0,
    }, safe=False, status=201)


@ensure_csrf_cookie
@api_view(['GET', 'POST'])
@login_required_401
@transaction.atomic
def chatroom_list(request):
    """ GET POST 'chatrooms/' get chatroom list of given user """
    if request.method == 'GET':
        return get_chatroom_list(request)
    if request.method == 'POST':
        return make_chatroom(request)


def get_chatroom(request, id):
    """ get chatroom information """
    try:
        user = request.user
        chatroom = ChatRoom.objects.get(id=id)
        messages = chatroom.message_set.select_related(
            'author').all().order_by('created_at')
        chat_user = user.chat_member.get(chatroom_id=chatroom.id)
        chat_user.notice = 0
        chat_user.save()
    except (ChatRoom.DoesNotExist, Message.DoesNotExist):
        return HttpResponseBadRequest()

    chatroom_collection = {
        "id": chatroom.id,
        "messages": [{
            "content": message.content,
            "author": message.author.username,
            "createdAt": get_time_format(message.created_at),
        } for message in messages],
        "lastChat": messages.last().content if messages.count() != 0 else LETS_CHAT_MESSAGE,
        "member": ChatMember.objects.filter(chatroom_id=chatroom.id).exclude(member_id=user.id).first().member.username,
        "updatedAt":  chatroom.updated_string,
        "chatCount": 0,
    }
    return JsonResponse(chatroom_collection, safe=False)


def send_message(request, id):
    """ send message to given chatroom """
    try:
        user = request.user
        content = json.loads(request.body.decode())['content']
        chatroom = ChatRoom.objects.get(id=id)
        chatroom.updated_at = timezone.now()
        Message.objects.create(
            author_id=user.id, content=content, chatroom_id=id)
        messages = chatroom.message_set.select_related(
            'author').all().order_by('created_at')
        chat_member = ChatMember.objects.select_related('member').filter(
            chatroom_id=chatroom.id).exclude(member_id=user.id).first()
        chat_member.notice += 1
        chat_member.save()
        chatroom.save()

    except (KeyError, json.decoder.JSONDecodeError):
        return HttpResponseBadRequest()
    except (ChatRoom.DoesNotExist, Message.DoesNotExist):
        return HttpResponseBadRequest()

    return JsonResponse(data={
        "id": chatroom.id,
        "messages": [{
            "content": message.content,
            "author": message.author.username,
            "createdAt": get_time_format(message.created_at),
        } for message in messages],
        "lastChat": messages.last().content if messages.count() != 0 else LETS_CHAT_MESSAGE,
        "member": chat_member.member.username,
        "updatedAt":  chatroom.updated_string,
        "chatCount": 0,
    }, safe=False)


def delete_chatroom(request, id):
    """ delete ChatRoom """
    try:
        chatroom = ChatRoom.objects.get(id=id)
        chatroom.delete()

    except ChatRoom.DoesNotExist:
        return HttpResponseBadRequest()

    return HttpResponse(status=204)


@ensure_csrf_cookie
@api_view(['GET', 'PUT', 'DELETE'])
@login_required_401
@transaction.atomic
def chatroom(request, id):
    """ GET, PUT, POST 'chatrooms/:id' request to given chatroom """
    if request.method == 'GET':
        return get_chatroom(request, id)
    elif request.method == 'PUT':
        return send_message(request, id)
    elif request.method == 'DELETE':
        return delete_chatroom(request, id)
