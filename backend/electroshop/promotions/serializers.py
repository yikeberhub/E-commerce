# promotions/serializers.py

from rest_framework import serializers
from .models import Promotion
from products.models import Product
from products.serializers import ProductSerializer


class PromotionSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True, required=False
    )

    class Meta:
        model = Promotion
        fields = [
            'id', 'title', 'description', 'discount_percentage',
            'start_date', 'end_date', 'product', 'product_id', 'active',
        ]
