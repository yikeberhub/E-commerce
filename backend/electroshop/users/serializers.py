from rest_framework.serializers import ModelSerializer
from .models import CustomUser,Address
import base64
from django.core.files.base import ContentFile

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model,authenticate


User = get_user_model()

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model= Address
        exclude = ['user']   
    

def set_default_address(id,user):
        addresses = Address.objects.filter(user = user)
        def_address =None
        for address in addresses:
            if address.id !=id:
                address.is_default =False
                address.save()
            else:
                address.is_default =True
                address.save()
                def_address =address
                print('def add',def_address)
        return def_address
       


class PublicUserSerializer(serializers.ModelSerializer):
    """Safe-to-expose subset of a user, for nesting in other users' views
    (e.g. a review's author, a vendor's owner) so PII/credentials never leak."""

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'first_name', 'last_name', 'profile_image']


class OrderContactSerializer(serializers.ModelSerializer):
    """Safe subset of a user for order participants (vendor/admin viewing a
    customer's order) — enough to fulfil the order, nothing financial/private."""

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'phone_number', 'profile_image']


class UserSerializer(serializers.ModelSerializer):
    addresses = AddressSerializer(many=True, read_only=True)

    class Meta:
        model = CustomUser
        exclude = ['password']
        read_only_fields = [
            'role', 'account_status', 'balance',
            'is_staff', 'is_superuser', 'is_active',
            'date_joined', 'last_login',
        ]


class AdminUserSerializer(UserSerializer):
    """Used only behind admin-only views: lets an admin change role/status/balance."""

    class Meta(UserSerializer.Meta):
        read_only_fields = ['is_staff', 'is_superuser', 'date_joined', 'last_login']

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
   

      