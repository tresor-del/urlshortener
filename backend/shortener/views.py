from rest_framework.response import Response
from rest_framework import generics
from rest_framework.authentication import TokenAuthentication
from rest_framework.views import APIView
from rest_framework import permissions
from django.shortcuts import get_object_or_404, redirect
import json

from .models import ShortenedUrl
from .serializers import ShortenedUrlSerializer, URLSerializer

class UrlView(generics.DestroyAPIView):
    queryset = ShortenedUrl.objects.all()
    serializer_class = URLSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        id = self.kwargs.get('id')  # Récupère le short_code depuis l'URL
        return ShortenedUrl.objects.get(id=id)

import requests
from bs4 import BeautifulSoup

def fetch_page_title(url):
    """Fetch the title of the webpage"""
    try:
        response = requests.get(url, timeout=5)
        soup = BeautifulSoup(response.text, 'html.parser')
        return soup.title.string if soup.title else "No Title"
    except:
        return "No Title"

class ShortenUrlView(APIView):

    def post(self, request):
        """
        Take the original URL and return a short code with title.
        """
        data = request.data
        serializer = ShortenedUrlSerializer(data=data)
        print(data)
        serializer.author = request.user
        print(request.user)
        if serializer.is_valid():
            short_url = serializer.save()

            # Fetch title if not provided
            if not short_url.title:
                short_url.title = fetch_page_title(short_url.original_url)
                short_url.save()

            return Response({
                'short_url': f'https://urls.{short_url.short_code}',
                'title': short_url.title,
                'created_at': short_url.created_at,
                'id': short_url.id,
                'author': short_url.author,
            })
        return Response(serializer.errors, status=400)



class URLListView(generics.ListAPIView):
    queryset = ShortenedUrl.objects.all()
    serializer_class = URLSerializer
    permission_classes = [permissions.AllowAny]
    

class RedirectUrlView(APIView):

    def get(self, request, short_code):
        url_entry = get_object_or_404(ShortenedUrl, short_code=short_code)
        return redirect(url_entry.original_url)
    