from rest_framework import serializers
from .models import Cart, CartItem
from products.serializers import ProductSerializer
from users.serializers import UserSerializer
from rest_framework.exceptions import NotFound

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    class Meta:
        model = CartItem
        fields = ['id','product', 'quantity']

    def validate_quantity(self, value):
    
        if value < 0:
            raise serializers.ValidationError("Quantity must be a positive integer.")
        return value


class CartSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = '__all__'
        read_only_fields = ['user','items', 'created_at', 'updated_at']

    