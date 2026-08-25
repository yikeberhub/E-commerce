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


class MyVendorSerializer(VendorSerializer):
    """Same as VendorSerializer but includes balance — safe here since
    this is only ever used to show a vendor their own profile."""
    class Meta(VendorSerializer.Meta):
        exclude = []


class VendorProfileUpdateSerializer(serializers.ModelSerializer):
    """Fields a vendor may edit on their own shop profile. Deliberately
    excludes is_active/account_status/authentic_rating/chat_response_time/
    shipping_on_time/subscription_plan/balance — those represent trust or
    performance state and must stay admin/system-controlled, not
    self-reported (VendorSerializer, used elsewhere, has no such
    restriction and would let a vendor PATCH their own approval flag or
    inflate their own rating)."""

    class Meta:
        model = Vendor
        fields = [
            'title', 'logo', 'banner_image', 'description', 'address',
            'email', 'phone_number', 'website', 'days_return', 'warranty_period',
        ]
