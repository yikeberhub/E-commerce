from django.shortcuts import render
from django.db.models import F, ExpressionWrapper, DecimalField

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Product, ProductReview
from .serializers import ProductSerializer, ProductReviewSerializer

# Product Views
class ProductListView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

# Product Review Views
class ProductReviewListView(generics.ListCreateAPIView):
    queryset = ProductReview.objects.all()
    serializer_class = ProductReviewSerializer

class ProductReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ProductReview.objects.all()
    serializer_class = ProductReviewSerializer
    

class FeaturedProductsView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = (
            Product.objects
            .filter(featured=True)
            .annotate(
                discount_percentage=ExpressionWrapper(
                    (F('old_price') - F('price')) / F('old_price') * 100,
                    output_field=DecimalField()
                )
            )
        )

        # Now you can order by the annotated field
        return queryset.order_by('-discount_percentage', '-ratings')[:10]  