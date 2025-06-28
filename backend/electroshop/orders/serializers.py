from rest_framework import serializers
from .models import Order, OrderItem,OrderItem
from vendors.serializer import VendorSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()  # Placeholder for ProductSerializer

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity']

    def get_product(self, obj):
        from products.serializers import ProductSerializer  # Lazy import
        return ProductSerializer(obj.product).data
    
class OrderItemDetailSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()  

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity']

    def get_product(self, obj):
        from products.serializers import ProductSerializer  # Lazy import
        return ProductSerializer(obj.product).data

class OrderSerializer(serializers.ModelSerializer):

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'status', 'payment']
    
class OrderDetailSerializer(serializers.ModelSerializer):
    vendor =VendorSerializer()
    payment = serializers.SerializerMethodField()  
    address = serializers.SerializerMethodField()  
    user = serializers.SerializerMethodField()     
    items = OrderItemDetailSerializer(many=True, read_only=True)

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
