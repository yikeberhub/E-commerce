from django.shortcuts import render
from django.db.models import F, ExpressionWrapper, DecimalField

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from .models import Product, ProductReview,Category,Tag,ProductImages
from .serializers import ProductSerializer,ProductDetailSerializer,ProductWriteSerializer, ProductReviewSerializer,CategorySerializer,TagSerializer,ProductImagesDetailSerializer
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser
from vendors.models import Vendor
from electroshop.permissions import IsOwnerOrAdminOrReadOnly, IsAdminOrReadOnly
from notifications.utils import notify
from django.utils import timezone


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
        existing_review = ProductReview.objects.filter(product_id=product_id, user=request.user).first()

        if existing_review:
            existing_review.rating = request.data.get('rating', existing_review.rating)
            existing_review.comment = request.data.get('comment', existing_review.comment)
            existing_review.save()
            return Response(self.get_serializer(existing_review).data, status=status.HTTP_200_OK)

        response = super().create(request)
        product = Product.objects.filter(id=product_id).first()
        if product and product.vendor and product.vendor.user:
            try:
                notify(
                    recipient=product.vendor.user,
                    notification_type='review',
                    title=f'New review on {product.title}',
                    message=f'{request.user.username} left a {request.data.get("rating")}-star review.',
                    link='/vendor-dashboard/feedback',
                )
            except Exception:
                pass
        return response

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, product_id=self.kwargs['product_id'])


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


class VendorReviewsView(generics.ListAPIView):
    """All reviews left on a vendor's own products (for the vendor's
    Feedback dashboard page)."""
    serializer_class = ProductReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        vendor = _vendor_for(self.request.user)
        if self.request.user.role != 'admin' and vendor is None:
            return ProductReview.objects.none()
        if self.request.user.role == 'admin':
            vendor_id = self.request.query_params.get('vendor')
            return ProductReview.objects.filter(product__vendor_id=vendor_id) if vendor_id else ProductReview.objects.all()
        return ProductReview.objects.filter(product__vendor=vendor).order_by('-created_at')


class ReviewReplyView(generics.UpdateAPIView):
    """Lets the owning vendor (or admin) reply to a review left on their
    product. Deliberately does not use IsOwnerOrAdmin: its "owner" check
    is obj.user, which for a review is the reviewing customer, not the
    vendor — that would let a customer "reply" to their own review."""
    serializer_class = ProductReviewSerializer
    permission_classes = [IsAuthenticated]
    queryset = ProductReview.objects.all()

    def get_object(self):
        review = generics.get_object_or_404(ProductReview, pk=self.kwargs['pk'])
        user = self.request.user
        is_owning_vendor = review.product.vendor and review.product.vendor.user_id == user.id
        if user.role != 'admin' and not is_owning_vendor:
            raise PermissionDenied("You can't reply to a review on someone else's product.")
        return review

    def patch(self, request, *args, **kwargs):
        review = self.get_object()
        reply = request.data.get('vendor_reply', '')
        review.vendor_reply = reply
        review.vendor_reply_at = timezone.now()
        review.save(update_fields=['vendor_reply', 'vendor_reply_at'])

        try:
            notify(
                recipient=review.user,
                notification_type='review',
                title='The vendor replied to your review',
                message=reply[:140],
                link=f'/product/{review.product_id}',
            )
        except Exception:
            pass

        return Response(self.get_serializer(review).data)


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


def _can_manage_product(user, product):
    if user.role == 'admin':
        return True
    return product.vendor is not None and product.vendor.user_id == user.id


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def add_product_image(request, product_id):
    product = generics.get_object_or_404(Product, id=product_id)
    if not _can_manage_product(request.user, product):
        return Response({'error': "You can't edit another vendor's product."}, status=status.HTTP_403_FORBIDDEN)

    files = request.FILES.getlist('image')
    if not files:
        return Response({'error': 'At least one image file is required.'}, status=status.HTTP_400_BAD_REQUEST)

    created = [ProductImages.objects.create(product=product, image=f) for f in files]
    serializer = ProductImagesDetailSerializer(created, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_product_image(request, image_id):
    image = generics.get_object_or_404(ProductImages, id=image_id)
    if not _can_manage_product(request.user, image.product):
        return Response({'error': "You can't edit another vendor's product."}, status=status.HTTP_403_FORBIDDEN)
    image.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


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