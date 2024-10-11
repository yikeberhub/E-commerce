from rest_framework import serializers
from users.serializers import UserSerializer,AddressSerializer
from products.serializers import ProductSerializer
from payments.serializers import PaymentSerializer

from .models import Order,OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    class Meta:
        model = OrderItem
        fields = ['id','product', 'quantity']

    def validate_quantity(self, value):
    
        if value < 0:
            raise serializers.ValidationError("Quantity must be a positive integer.")
        return value


class OrderSerializer(serializers.ModelSerializer):
    payment = PaymentSerializer()
    address = AddressSerializer()
    user = UserSerializer()
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['user','created_at', 'updated_at','status','paid']