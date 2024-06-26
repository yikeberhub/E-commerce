from rest_framework.serializers import ModelSerializer
from .models import User,Product,Category

class UserSerialezer(ModelSerializer):
    class Meta:
        model =User
        fields = '__all__'
        
class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = '__all__'
