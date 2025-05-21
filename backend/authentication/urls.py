from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from authentication.views import RegisterView, UserListView, UserDetail

urlpatterns = [
    path('users/', UserListView.as_view(), name='user_list_create'),
    path('user/', UserDetail.as_view(), name='customuser-detail'),
    path('register/', RegisterView.as_view(), name='register'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
