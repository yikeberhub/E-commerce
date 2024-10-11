from rest_framework import serializers
from .models import Payment
class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'user','order', 'payment_status', 'amount', 'transaction_id', 'created_at']
        read_only_fields = ['id', 'order', 'created_at']

    def create(self, validated_data):
        return Payment.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.payment_status = validated_data.get('payment_status', instance.payment_status)
        instance.amount = validated_data.get('amount', instance.amount)
        instance.transaction_id = validated_data.get('transaction_id', instance.transaction_id)
        instance.save()
        return instance