from rest_framework import serializers
from .models import Vendor,VendorPayment
from users.serializers import UserSerializer



class VendorPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorPayment
        fields = '__all__'

class VendorSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Vendor
        fields = '__all__'

    def create(self, validated_data):
        vendor = Vendor(**validated_data)  
        vendor.save()
        return vendor
