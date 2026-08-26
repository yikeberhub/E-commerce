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
    discount_percentage = serializers.SerializerMethodField()

    class Meta:
        model = Promotion
        fields = [
            'id', 'title', 'description', 'discount_percentage',
            'start_date', 'end_date', 'product', 'product_id', 'active',
            'banner_image',
        ]

    def get_discount_percentage(self, obj):
        """Always mirrors the product's own price-vs-old-price discount —
        the same number shown on the Featured Products badge — so a
        promoted product never shows a different % than its own product
        card, even if price changes after the promotion was created."""
        if obj.product:
            return obj.product.calculate_discount_percentage()
        return obj.discount_percentage

    def create(self, validated_data):
        product = validated_data.get('product')
        validated_data['discount_percentage'] = product.calculate_discount_percentage() if product else 0
        return super().create(validated_data)

    def update(self, instance, validated_data):
        product = validated_data.get('product', instance.product)
        validated_data['discount_percentage'] = product.calculate_discount_percentage() if product else 0
        return super().update(instance, validated_data)
