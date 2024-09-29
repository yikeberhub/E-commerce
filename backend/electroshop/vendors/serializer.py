from rest_framework import serializers
from users.serializers import UserSerializer
from .models import Vendor

class VendorSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Vendor
        fields = '__all__'

    def create(self, validated_data):
        vendor = Vendor(**validated_data)
        vendor.user.set_password(validated_data['password'])  # Hash the password
        vendor.save()
        return vendor

    # def validate_email(self, value):
    #     if CustomUser.objects.filter(email=value).exists():
    #         raise serializers.ValidationError(_("This email is already in use."))
    #     return value

    # def validate_username(self, value):
    #     if CustomUser.objects.filter(username=value).exists():
    #         raise serializers.ValidationError(_("This username is already taken."))
    #     return value