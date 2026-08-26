# promotions/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from products.models import Product
from .models import Promotion
from .serializers import PromotionSerializer


def _can_manage(user, product):
    if user.role == 'admin':
        return True
    return bool(product and product.vendor and product.vendor.user_id == user.id)


class PromotionList(APIView):
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]

    def get(self, request):
        promotions = Promotion.objects.all()
        vendor_id = request.query_params.get('vendor')
        if vendor_id:
            promotions = promotions.filter(product__vendor_id=vendor_id)
        serializer = PromotionSerializer(promotions, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        product = Product.objects.filter(id=request.data.get('product_id')).first()
        if not _can_manage(request.user, product):
            return Response({'error': 'You can only create promotions for your own products.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = PromotionSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PromotionDetail(APIView):
    """
    Retrieve, update or delete a promotion instance.
    """

    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_object(self, pk):
        try:
            return Promotion.objects.get(pk=pk)
        except Promotion.DoesNotExist:
            return None

    def get(self, request, pk):
        promotion = self.get_object(pk)
        if promotion is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = PromotionSerializer(promotion, context={'request': request})
        return Response(serializer.data)

    def put(self, request, pk):
        promotion = self.get_object(pk)
        if promotion is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        if not _can_manage(request.user, promotion.product):
            return Response({'error': 'You can only edit promotions for your own products.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = PromotionSerializer(promotion, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        promotion = self.get_object(pk)
        if promotion is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        if not _can_manage(request.user, promotion.product):
            return Response({'error': 'You can only delete promotions for your own products.'}, status=status.HTTP_403_FORBIDDEN)
        promotion.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)