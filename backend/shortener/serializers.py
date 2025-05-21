from rest_framework import serializers

from .models import ShortenedUrl


class ShortenedUrlSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShortenedUrl
        fields = ['title','original_url']

class URLSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShortenedUrl
        fields = ['id', 'original_url', 'short_code','title' ,'created_at', 'author']