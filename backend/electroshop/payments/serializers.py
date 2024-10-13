from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    order = serializers.SerializerMethodField()
                    
    class Meta:
        model = Payment
        fields = ['id', 'order', 'payment_status', 'transaction_id', 'created_at']
        read_only_fields = ['id', 'order', 'created_at']

    def get_order(self, obj):
        from orders.serializers import OrderSerializer  
        if hasattr(obj, 'order'):
            return OrderSerializer(obj.order).data
        return None

    def create(self, validated_data):
        return Payment.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.payment_status = validated_data.get('payment_status', instance.payment_status)
        instance.transaction_id = validated_data.get('transaction_id', instance.transaction_id)
        instance.save()
        return instance