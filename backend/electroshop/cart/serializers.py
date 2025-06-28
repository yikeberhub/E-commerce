from rest_framework import serializers
from .models import Cart, CartItem
from products.serializers import ProductSerializer, ProductDetailSerializer
from users.serializers import UserSerializer


class CartItemSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity']

    def get_product(self, obj):
        request = self.context.get('request')
        return ProductSerializer(obj.product, context={'request': request}).data

    def validate_quantity(self, value):
        if value < 0:
            raise serializers.ValidationError("Quantity must be a positive integer.")
        return value


class CartItemDetailSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity']

    def get_product(self, obj):
        request = self.context.get('request')
        print('cart item detail request is',request)
        return ProductDetailSerializer(obj.product, context={'request': request}).data

    def validate_quantity(self, value):
        if value < 0:
            raise serializers.ValidationError("Quantity must be a positive integer.")
        return value


class CartSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    items = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = '__all__'
        read_only_fields = ['user', 'items', 'created_at', 'updated_at']

    def get_items(self, obj):
        request = self.context.get('request')
        return CartItemSerializer(obj.items.all(), many=True, context={'request': request}).data


class CartDetailSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    items = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = '__all__'
        read_only_fields = ['user', 'items', 'created_at', 'updated_at']

    def get_items(self, obj):
        request = self.context.get('request')
        print('cart detail request is',request)
        return CartItemDetailSerializer(obj.items.all(), many=True, context={'request': request}).data
