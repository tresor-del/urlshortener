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
    
    
    def validated_email(self, value):
        """ Check that every user have his own email """
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError('Un utilisateur avec cet Email existe déjà')
        return value
    
    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email = validated_data['email'],
            username= validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user