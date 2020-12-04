"""admin for chatroom"""
from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse, HttpResponseBadRequest, HttpResponseNotFound
from django.views.decorators.csrf import ensure_csrf_cookie
from chatroom.models import ChatRoom, ChatMember, Message
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.db.models import Q
import json

User = get_user_model()
# import socketio
# sio = socketio.Client()
# sio.connect('http://localhost:3000')


def get_time_format(time_str):
    return time_str.strftime("%y.%m.%d") if time_str.strftime("%y.%m.%d") != timezone.now().strftime("%y.%m.%d") \
        else time_str.strftime("%H:%M %p")


@ensure_csrf_cookie
def get_chatroom_list(request):
    try:
        user = request.user
        chatrooms = ChatRoom.objects.filter(
            chat_member__member=user).order_by('-updated_at')
    except User.DoesNotExist:
        return HttpResponseNotFound()
    except ChatRoom.DoesNotExist:
        return JsonResponse([], safe=False)

    try:
        chatroom_collection = [{
            "id": chatroom.id,
            "lastChat": chatroom.message_set.all().last().content if chatroom.message_set.count() != 0 else "채팅을 시작해보세요!",
            "member": "test-uset",
            "updatedAt":  get_time_format(chatroom.updated_at),
            "chatCount": 0,
        } for chatroom in chatrooms]
    except Message.DoesNotExist:
        return HttpResponseBadRequest()
    except ChatMember.DoesNotExist:
        return HttpResponseBadRequest()

    return JsonResponse(chatroom_collection, safe=False)


def make_chatroom(request):
    user = request.user
    try:
        friend_id = json.loads(request.body.decode())['friend_id']
        friend = User.objects.get(id=friend_id)
        # chatroom = ChatRoom.objects.select_related(
        #     'chat_members').filter(Q(chat_member__member_user=user) & Q(chat_member__member_user=friend)).get_or_create()
        chatroom = ChatRoom.objects.create()
        ChatMember.objects.create(member=user, chatroom_id=chatroom.id)
        ChatMember.objects.create(member=friend, chatroom_id=chatroom.id)
        chatroom.save()
    except (KeyError, json.decoder.JSONDecodeError):
        return HttpResponseBadRequest()
    except ChatRoom.DoesNotExist:
        return HttpResponseBadRequest()

    return JsonResponse(data={
        "id": chatroom.id,
        "messages": [{
            "content": message.content,
            "author": message.author.user.username,
            "createdAt": get_time_format(message.created_at),
        } for message in chatroom.message_set.all()],
        "lastChat": chatroom.message_set.last() if chatroom.message_set.count() != 0 else "채팅을 시작해보세요!",
        "member": friend.username
    }, safe=False)


@ensure_csrf_cookie
def chatroom_list(request):
    """ get chatroom list of given user """
    if request.method not in ['GET', 'POST']:
        return HttpResponseNotAllowed(['GET', 'POST'])

    if not request.user.is_authenticated:
        return HttpResponse(status=401)
    if request.method == 'GET':
        return get_chatroom_list(request)
    elif request.method == 'POST':
        return make_chatroom(request)
    else:
        return HttpResponse(status=400)


def get_chatroom(request, id):
    """ get chatroom information """
    try:
        user = request.user
        chatroom = ChatRoom.objects.get(id=id)
        messages = chatroom.message_set.all().order_by('-created_at')
    except (ChatRoom.DoesNotExist, Message.DoesNotExist):
        return HttpResponseBadRequest()

    chatroom_collection = {
        "id": chatroom.id,
        "lastChat": chatroom.message_set.all().last().content if chatroom.message_set.count() != 0 else "채팅을 시작해보세요!",
        "messages": [{
            "content": message.content,
            "author": message.author.username,
            "createdAt": get_time_format(message.created_at),
        } for message in chatroom.message_set.all()],
        "member": user.username,
    }
    return JsonResponse(chatroom_collection, safe=False)


@ensure_csrf_cookie
def send_message(request, id):
    """ send message to given chatroom """
    try:
        user = request.user
        content = json.loads(request.body.decode())['content']
        chatroom = ChatRoom.objects.get(id=id)
        Message.objects.create(
            author_id=user.id, content=content, chatroom_id=id)

    except (KeyError, json.decoder.JSONDecodeError):
        return HttpResponseBadRequest()
    except (ChatRoom.DoesNotExist):
        return HttpResponseBadRequest()

    return JsonResponse(data={
        "id": chatroom.id,
        "messages": [{
            "content": message.content,
            "author": message.author.username,
            "createdAt": get_time_format(message.created_at),
        } for message in chatroom.message_set.all()],
        "lastChat": chatroom.message_set.last().content if chatroom.message_set.count() != 0 else "채팅을 시작해보세요!",
        "member": "test-user"
    }, safe=False)


@ensure_csrf_cookie
def chatroom(request, id):
    """ request to given chatroom """
    if request.method not in ['GET', 'PUT']:
        return HttpResponseNotAllowed(['GET', 'PUT'])

    if not request.user.is_authenticated:
        return HttpResponse(status=401)
    if request.method == 'GET':
        return get_chatroom(request, id)
    else:
        return send_message(request, id)
