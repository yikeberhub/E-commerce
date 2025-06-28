from rest_framework import serializers
from .models import WishlistItem, Wishlist
from products.serializers import ProductSerializer
from users.serializers import UserSerializer
from rest_framework.exceptions import NotFound

class WishlistItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    class Meta:
        model = WishlistItem
        fields = ['id','product', 'quantity']

    def validate_quantity(self, value):
    
        if value < 0:
            raise serializers.ValidationError("Quantity must be a positive integer.")
        return value
class WishlistItemDetailSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    class Meta:
        model = WishlistItem
        fields = ['id','product', 'quantity']

    def validate_quantity(self, value):
    
        if value < 0:
            raise serializers.ValidationError("Quantity must be a positive integer.")
        return value


class WishlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wishlist
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

    
class WishlistDetailSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    items = WishlistItemDetailSerializer(many=True, read_only=True)

    class Meta:
        model = Wishlist
        fields = '__all__'
        read_only_fields = ['id','user','items', 'created_at', 'updated_at']

    