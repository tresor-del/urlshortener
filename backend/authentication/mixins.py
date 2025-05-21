from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework_simplejwt.tokens import RefreshToken


class CreateUserMixin(generics.GenericAPIView):
        def create(self, request, *args, **kwargs):
            serializer = super().get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            response_data = {
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                },
                'token': {
                    'refresh': str(refresh),
                    'access': access_token,
                }
            }
            
            return Response(response_data, status=status.HTTP_201_CREATED)
    
        