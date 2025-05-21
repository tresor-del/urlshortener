from rest_framework import generics
from rest_framework import permissions
from rest_framework.response import Response

from .serializers import UserSerializer, RegisterSerializer
from .models import CustomUser
from .mixins import CreateUserMixin

    

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        obj = super().get_object()
        return self.request.user

class UserListView(CreateUserMixin, generics.ListCreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class =RegisterSerializer
    permission_classes = [permissions.IsAdminUser]
      
class RegisterView(CreateUserMixin, generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


