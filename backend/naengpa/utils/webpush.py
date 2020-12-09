import json
from django.contrib.auth import get_user_model
from webpush import send_user_notification


def episode_webpush(episode):
    User = get_user_model()
    users = User.objects.all()

    payload = {"head": f"{episode.__str__()}이 업데이트 되었습니다.", "body": f"{episode.__str__()} 업데이트 일시 : {episode.modify_date}",
               "icon": "https://i.imgur.com/...", "url": f"{episode.get_absolute_url()}"}

    # json으로 변환 https://github.com/safwanrahman/django-webpush/issues/71
    payload = json.dumps(payload)

    for user in users:
        push_infos = user.webpush_info.select_related("subscription")

        for push_info in push_infos:
            send_user_notification(push_info.subscription, payload)
