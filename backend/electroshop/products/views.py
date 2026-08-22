from django.shortcuts import render
from django.db.models import F, ExpressionWrapper, DecimalField

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from .models import Product, ProductReview,Category,Tag
from .serializers import ProductSerializer,ProductDetailSerializer,ProductWriteSerializer, ProductReviewSerializer,CategorySerializer,TagSerializer
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser
from vendors.models import Vendor
from electroshop.permissions import IsOwnerOrAdminOrReadOnly, IsAdminOrReadOnly


def _vendor_for(user):
    return Vendor.objects.filter(user=user).first()


# Product Views
class ProductListView(generics.ListCreateAPIView):
    queryset = Product.objects.all()

    def get_serializer_class(self):
        return ProductWriteSerializer if self.request.method == 'POST' else ProductSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]

    def perform_create(self, serializer):
        vendor = _vendor_for(self.request.user)
        if self.request.user.role != 'vendor' or vendor is None:
            raise PermissionDenied('Only an approved vendor can add products.')
        serializer.save(user=self.request.user, vendor=vendor)

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    permission_classes = [IsOwnerOrAdminOrReadOnly]

    def get_serializer_class(self):
        return ProductWriteSerializer if self.request.method in ('PUT', 'PATCH') else ProductDetailSerializer

class ProductReviewCreateUpdateView(generics.CreateAPIView):
    serializer_class = ProductReviewSerializer
    permission_classes = [IsAuthenticated]

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

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]

class ProductReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProductReviewSerializer
    permission_classes = [IsOwnerOrAdminOrReadOnly]

    def get_queryset(self):
        product_id = self.kwargs.get("product_id")
        product = Product.objects.get(id=product_id)
        return ProductReview.objects.filter(product=product)

class CategoryList(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]

class CategoryDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]


class TagList(generics.ListCreateAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAdminOrReadOnly]


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def add_product(request):
    vendor = _vendor_for(request.user)
    if request.user.role != 'vendor' or vendor is None:
        return Response({'error': 'Only an approved vendor can add products.'}, status=status.HTTP_403_FORBIDDEN)

    serializer = ProductSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user, vendor=vendor)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




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