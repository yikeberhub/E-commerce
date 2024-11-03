from rest_framework import serializers
from .models import Order, OrderItem
from vendors.serializer import VendorSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()  # Placeholder for ProductSerializer

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity']

    def get_product(self, obj):
        from products.serializers import ProductSerializer  # Lazy import
        return ProductSerializer(obj.product).data

class OrderSerializer(serializers.ModelSerializer):
    vendor =VendorSerializer()
    payment = serializers.SerializerMethodField()  # Placeholder for PaymentSerializer
    address = serializers.SerializerMethodField()  # Placeholder for AddressSerializer
    user = serializers.SerializerMethodField()     # Placeholder for UserSerializer
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at', 'status', 'payment']

    def get_payment(self, obj):
        from payments.serializers import PaymentSerializer  
        if hasattr(obj, 'payment'):
            return PaymentSerializer(obj.payment).data
        return None

    def get_address(self, obj):
        from users.serializers import AddressSerializer  
        return AddressSerializer(obj.address).data

    def get_user(self, obj):
        from users.serializers import UserSerializer 
        return UserSerializer(obj.user).data
