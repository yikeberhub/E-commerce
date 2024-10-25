# promotions/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Promotion
from .serializers import PromotionSerializer

class PromotionList(APIView):
    def get(self, request):
        promotions = Promotion.objects.all()
        serializer = PromotionSerializer(promotions, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PromotionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PromotionDetail(APIView):
    """
    Retrieve, update or delete a promotion instance.
    """

    def get_object(self, pk):
        try:
            return Promotion.objects.get(pk=pk)
        except Promotion.DoesNotExist:
            return None

    def get(self, request, pk):
        promotion = self.get_object(pk)
        if promotion is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = PromotionSerializer(promotion)
        return Response(serializer.data)

    def put(self, request, pk):
        promotion = self.get_object(pk)
        if promotion is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = PromotionSerializer(promotion, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        promotion = self.get_object(pk)
        if promotion is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        promotion.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)