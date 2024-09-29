from rest_framework.serializers import ModelSerializer
from .models import User,Product,Category,Profile

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['user_id'] = user.id
        token['email'] = user.email

        return token


        

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'date_joined', 'is_admin', 'is_active', 'is_staff', 'is_superuser']
        read_only_fields = ['id', 'date_joined']

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data.get('password'))  # Ensure password is hashed
        user.save()
        return user

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr == 'password':
                instance.set_password(value)  # Hash the password
            else:
                setattr(instance, attr, value)
        instance.save()
        return instance
    
class ProfileSerializer(ModelSerializer):
    user = UserSerializer(Profile.user)
    class Meta:
        model = Profile
        fields = ['profile_picture','user']
        
class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = '__all__'
        
