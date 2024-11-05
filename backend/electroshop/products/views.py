from django.shortcuts import render
from django.db.models import F, ExpressionWrapper, DecimalField

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Product, ProductReview,Category,Tag
from .serializers import ProductSerializer, ProductReviewSerializer,CategorySerializer,TagSerializer
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser

# Product Views
class ProductListView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
class ProductReviewCreateUpdateView(generics.CreateAPIView):
    serializer_class = ProductReviewSerializer

    def post(self, request, product_id):
        print('works')
        existing_review = ProductReview.objects.filter(product_id=product_id, user=request.user).first()
        print('review exist')
        print('user',request.user)
        
        if existing_review:
            print('request data',request.data.get('rating'))
            existing_review.rating = request.data.get('rating', existing_review.rating)
            existing_review.comment = request.data.get('comment', existing_review.comment)
            existing_review.save()
            return Response(self.get_serializer(existing_review).data, status=status.HTTP_200_OK)
        else:
            print('esle')
            # Create a new review
            return super().create(request)
        
class ProductReviewListView(generics.ListCreateAPIView):
    queryset = ProductReview.objects.all()
    serializer_class = ProductReviewSerializer

class ProductReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProductReviewSerializer

    def get_queryset(self):
        product_id = self.kwargs.get("product_id")
        product = Product.objects.get(id=product_id)
        return ProductReview.objects.filter(product=product)
    
class CategoryList(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class CategoryDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class TagList(generics.ListCreateAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    
    
@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def add_product(request):
    serializer = ProductSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    retu
    



class FeaturedProductsView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = (
            Product.objects
            .filter(featured=True)
            .annotate(
                calculated_discount_percentage=ExpressionWrapper(
                    (F('old_price') - F('price')) / F('old_price') * 100,
                    output_field=DecimalField()
                )
            )
        )

        return queryset.order_by('-calculated_discount_percentage', '-ratings')[:10]