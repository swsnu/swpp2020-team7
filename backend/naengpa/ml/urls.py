"""urls for ingredient"""
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from ml import views

urlpatterns = [
    path('', views.extract_ml_feature, name='extract_ml_feature'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
