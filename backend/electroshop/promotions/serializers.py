# promotions/serializers.py

from rest_framework import serializers
from .models import Promotion
from products.serializers import ProductSerializer
class PromotionSerializer(serializers.ModelSerializer):
        product = ProductSerializer( read_only=True)  
        class Meta:
            model = Promotion
            fields = '__all__' 