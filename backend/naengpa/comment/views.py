"""views for comment"""
import json
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest, HttpResponseForbidden, HttpResponseNotFound
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from utils.auth import login_required_401
from .models import Comment, CommentLike


@ensure_csrf_cookie
@api_view(['PUT', 'DELETE'])
@login_required_401
def comment_info(request, cid):
    """delete comment of given cid"""
    if request.method == 'DELETE':
        comment = get_object_or_404(Comment, pk=cid)
        comment.delete()
        return HttpResponse(status=204)
    elif request.method == 'PUT':
        comment = get_object_or_404(Comment, pk=cid)
        user_id = request.user.id
        if user_id != comment.author.id:
            return HttpResponseForbidden()
        try:
            new_content = request.data['content']
            comment.content = new_content
            comment.save(update_fields=['content'])
            user_like = CommentLike.objects.filter(
                comment_id=cid, user_id=user_id).count()
        except (KeyError, json.decoder.JSONDecodeError) as e:
            return HttpResponseBadRequest()
        return JsonResponse(data={
            'id': comment.id,
            'author': comment.author.name,
            'profileImage': comment.author.profile_image,
            'recipeId': comment.recipe_id,
            'content': comment.content,
            'userLike': user_like,
            'totalLikes': comment.total_likes,
            'createdAt': comment.created_string,
        }, status=201)


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
            'userLike': 0,
            'totalLikes': comment.total_likes,
            'createdAt': comment.created_string,
        }, status=201)


@ensure_csrf_cookie
@api_view(['PUT'])
@login_required_401
def comment_like(request, id):
    """like comment of given id"""
    user_id = request.user.id
    try:
        like = CommentLike.objects.get(comment_id=id, user_id=user_id)
        like.delete()
    except CommentLike.DoesNotExist:
        like = CommentLike.objects.create(comment_id=id, user_id=user_id)

    updated_comment = {
        'id': like.comment.id,
        'author': like.comment.author.name,
        'profileImage': like.comment.author.profile_image,
        'recipeId': like.comment.recipe_id,
        'content': like.comment.content,
        'userLike': 1 if like else 0,
        'totalLikes': like.comment.total_likes,
        'createdAt': like.comment.created_string,
    }
    return JsonResponse(updated_comment)
