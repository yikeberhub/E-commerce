from rest_framework import serializers
from .models import Payment,Transaction,WithdrawalRequest
from orders.serializers import OrderSerializer

from users.models import CustomUser
from users.serializers import UserSerializer


class TransactionSerializer(serializers.ModelSerializer):
    user = UserSerializer()  

    class Meta:
        model = Transaction
        fields = ['id', 'user', 'amount', 'transaction_date', 'order_id', 'transaction_type']
        read_only_fields = ['id', 'transaction_date']

    def create(self, validated_data):
        user_data = validated_data.pop('user')  
        user = CustomUser.objects.get(id=user_data['id'])  
        return Transaction.objects.create(user=user, **validated_data)

    def update(self, instance, validated_data):
        instance.amount = validated_data.get('amount', instance.amount)
        instance.order_id = validated_data.get('order_id', instance.order_id)
        instance.transaction_type = validated_data.get('transaction_type', instance.transaction_type)
        instance.save()
        return instance

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'order', 'payment_status', 'transaction_id', 'amount', 'currency', 'payment_method',
                  'chapa_sub_method', 'charge', 'payment_gateway', 'created_at', 'updated_at']


class VendorPaymentSerializer(serializers.ModelSerializer):
    order_id = serializers.IntegerField(source='order.id', read_only=True)
    customer = serializers.CharField(source='order.user.username', read_only=True)
    customer_id = serializers.IntegerField(source='order.user.id', read_only=True)
    vendor = serializers.SerializerMethodField()
    vendor_id = serializers.SerializerMethodField()

    class Meta:
        model = Payment
        fields = [
            'id', 'order_id', 'customer', 'customer_id', 'vendor', 'vendor_id',
            'payment_status', 'transaction_id',
            'amount', 'currency', 'payment_method', 'chapa_sub_method',
            'payment_gateway', 'created_at',
        ]

    def get_vendor(self, obj):
        return obj.order.vendor.title if obj.order and obj.order.vendor else None

    def get_vendor_id(self, obj):
        return obj.order.vendor_id if obj.order else None
        
   
    def create(self, validated_data):
        return Payment.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.amount = validated_data.get('amount', instance.amount)
        instance.payment_status = validated_data.get('payment_status', instance.payment_status)
        instance.transaction_id = validated_data.get('transaction_id', instance.transaction_id)
        instance.payment_gateway = validated_data.get('payment_gateway', instance.payment_gateway)
        instance.payment_method = validated_data.get('payment_method', instance.payment_method)
        instance.currency = validated_data.get('currency', instance.currency)
        instance.save()
        return instance


class WithdrawalRequestSerializer(serializers.ModelSerializer):
    vendor_title = serializers.CharField(source='vendor.title', read_only=True)

    class Meta:
        model = WithdrawalRequest
        fields = [
            'id', 'vendor', 'vendor_title', 'amount', 'payout_method', 'account_details',
            'status', 'admin_note', 'requested_at', 'reviewed_at',
        ]
        read_only_fields = ['id', 'vendor', 'status', 'admin_note', 'requested_at', 'reviewed_at']