from .models import CustomUser

from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CustomUser
        fields = [ 'url' ,'id', 'email', 'is_staff']



class RegisterSerializer(serializers.HyperlinkedModelSerializer):
    # password = serializers.CharField(write_only=True)
    class Meta:
        model = CustomUser
        fields = ['url', 'email', 'password', 'is_staff']
        extra_kwargs = {'password': {'write_only': True}}
    
    
    def validate(self, data):
        """ 
        Check that every user have his own email 
        """
        # email = data.get('email')
        # password = data.get('password')

        # if email in password:
        #     raise serializers.ValidationError({'password': 'Password must not contain username'})
        
        if CustomUser.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({'email': 'Un utilisateur avec cet Email existe déjà'})
        return data
    
    def create(self, validated_data):
        email = validated_data['email']
        password = validated_data['password']
        user = CustomUser.objects.create_user(username=email, email=email)
        user.set_password(password)
        user.save()
        return user