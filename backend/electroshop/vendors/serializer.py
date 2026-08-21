from rest_framework import serializers
from .models import Vendor,VendorPayment
from users.serializers import PublicUserSerializer



class VendorPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorPayment
        fields = '__all__'

class VendorSerializer(serializers.ModelSerializer):
    user = PublicUserSerializer(read_only=True)
    class Meta:
        model = Vendor
        exclude = ['balance']

    def create(self, validated_data):
        vendor = Vendor(**validated_data)  
        vendor.save()
        return vendor
