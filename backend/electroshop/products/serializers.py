
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers

from .models import Category,Product,ProductImages,ProductReview,Tag
from users.serializers import UserSerializer
from vendors.serializer import VendorSerializer

  
class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        
        
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']



class ProductReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = ProductReview
        fields = ['id', 'user', 'rating', 'comment', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['user'] = request.user  

        return super().create(validated_data)


class ProductImagesSerializer(ModelSerializer):    
    class Meta:
        model = ProductImages
        fields = ['id','image']
 
class ProductSerializer(serializers.ModelSerializer):
    reviews = ProductReviewSerializer(many=True, read_only=True)  
    tags = TagSerializer(many=True)  
    vendor = VendorSerializer()
    category = CategorySerializer(read_only=True)
    images = ProductImagesSerializer(many=True, required=False)
    discount_percentage = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    number_of_reviews = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields ='__all__'

    def get_discount_percentage(self, obj):
        return obj.calculate_discount_percentage()  

    def get_average_rating(self, obj):
        return obj.average_rating()

    def get_number_of_reviews(self, obj):
        return obj.number_of_reviews()
    
