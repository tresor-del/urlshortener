from django.urls import path

from .views import ShortenUrlView, RedirectUrlView, URLListView, UrlView

urlpatterns = [
    path('urls/',URLListView.as_view(), name='urls'),
    path('shorten/<int:id>', UrlView.as_view(), name='delete-url'),
    path('shorten/', ShortenUrlView.as_view(), name='shorten'),
    path('<str:short_code>/', RedirectUrlView.as_view(), name='redirect')
]