
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers

from .models import Category,Product,ProductImages,ProductReview
from users.serializers import UserSerializer
from vendors.serializer import VendorSerializer
  
class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'



class ProductImagesSerializer(ModelSerializer):    
    class Meta:
        model = ProductImages
        fields = ['id','image']
        
class ProductSerializer(ModelSerializer):
    vendor=VendorSerializer()
    category = CategorySerializer(read_only=True)
    images = ProductImagesSerializer(many = True,required = False)
    # discount_percentage = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()


    class Meta:
        model = Product
        fields = '__all__'
        
    # def get_discount_percentage(self, obj):
    #     return obj.discount_percentage()
    
    def get_average_rating(self, obj):
        
        return obj.average_rating()
        
        

class ProductReviewSerializer(ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = ProductReview
        fields = ['id', 'product', 'user', 'rating', 'comment', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']  

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError('Rating must be between 1 and 5.')
        return value
