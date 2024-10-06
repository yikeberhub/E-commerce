from rest_framework.serializers import ModelSerializer
from .models import CustomUser
import base64
from django.core.files.base import ContentFile

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model,authenticate


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'profile_image']

    def create(self, validated_data):
        profile_image = validated_data.pop('profile_image', None)
        user = CustomUser(**validated_data)
        user.set_password(validated_data['password'])  # Hash the password
        if profile_image is not None:
            user.profile_image = profile_image
        user.save()
        return user
    
    # def update(self, validated_data):
    #     profile_image = validated_data.pop('profile_image', None)
    #     user = CustomUser(**validated_data)
    #     user.set_password(validated_data['password'])  # Hash the password
    #     if profile_image is not None:
    #         user.profile_image = profile_image
    #     user.save()
    #     return user

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError(_("This email is already in use."))
        return value

    def validate_username(self, value):
        if CustomUser.objects.filter(username=value).exists():
            raise serializers.ValidationError(("This username is already taken."))
        return value

    # def validate(self, attrs):
    #     if attrs['password'] != attrs['confirmPassword']:
    #         raise serializers.ValidationError({"password": _("Passwords do not match.")})
    #     return attrs

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    def validate_email(self,value):
            user = User.objects.filter(email = value).first()
            if user is None:
                raise serializers.ValidationError('Email not found!.',code='email')
    def validate_password(self,value):
            user = User.objects.filter(email = self.initial_data['email']).first()
            if user and  not user.check_password(value):
                raise serializers.ValidationError('Incorrect password!.',code='password')
    def validate(self,attrs):
            user = CustomUser.objects.filter(email=self.initial_data['email']).first()
            if user is None:
                raise serializers.ValidationError('Invalid credential!')
            user.is_active = True
            user.is_email_verified = True
            user.save()
            attrs['user'] = user
            return attrs
   

      