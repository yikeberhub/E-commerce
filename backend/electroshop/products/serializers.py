
from rest_framework.serializers import ModelSerializer

from .models import Category,Product,ProductImages
  
class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'



class ProductImagesSerializer(ModelSerializer):    
    class Meta:
        model = ProductImages
        fields = ['id','image']
        
class ProductSerializer(ModelSerializer):
    category = CategorySerializer(read_only=True)
    images = ProductImagesSerializer(many = True,required = False)

    class Meta:
        model = Product
        fields = '__all__'
