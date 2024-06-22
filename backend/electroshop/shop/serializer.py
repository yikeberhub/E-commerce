from rest_framework.serializers import ModelSerializer
from .models import User,Product

class UserSerialezer(ModelSerializer):
    class Meta:
        model =User
        fields = '__all__'
        

class ProductSerializer(ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'