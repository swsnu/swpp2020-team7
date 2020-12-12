"""views for comment"""
import json
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from utils.auth import login_required_401
from .models import Comment


@ensure_csrf_cookie
@api_view(['DELETE'])
@login_required_401
def comment_info(request, cid):
    """delete comment of given cid"""
    if request.method == 'DELETE':
        comment = get_object_or_404(Comment, pk=cid)
        comment.delete()
        return HttpResponse(status=204)


@ensure_csrf_cookie
@api_view(['POST'])
@login_required_401
def comment_list(request):
    """create comment"""
    if request.method == 'POST':
        try:
            recipe_id, content = request.data['recipeId'], request.data['content']
        except (KeyError, json.decoder.JSONDecodeError):
            return HttpResponseBadRequest()
        comment = Comment.objects.create(
            author_id=request.user.id,
            recipe_id=recipe_id,
            content=content,
        )
        return JsonResponse(data={
            'id': comment.id,
            'author': comment.author.name,
            'profileImage': comment.author.profile_image,
            'recipeId': comment.recipe_id,
            'content': comment.content,
            'createdAt': comment.created_string,
        }, status=201)
