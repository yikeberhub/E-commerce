from rest_framework import serializers
from .models import Payment,Transaction

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
    order = serializers.SerializerMethodField()
                    
    class Meta:
        model = Payment
        fields ='__all__'
        # fields = ['id', 'order', 'payment_status','currency','charge','payment_gateway','payment_method', 'transaction_id', 'created_at']
        read_only_fields = ['id', 'order', 'created_at']

    def get_order(self, obj):
        from orders.serializers import OrderSerializer  
        if hasattr(obj, 'order'):
            return OrderSerializer(obj.order).data
        return None

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