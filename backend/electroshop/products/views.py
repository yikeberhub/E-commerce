from django.shortcuts import render
from django.core import exceptions
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import generics

from .models import Product,ProductImages,Category
from .serializers import ProductSerializer


# Create your views here.

@api_view(['GET'])
def product_list(request):
    try:
      products = Product.objects.all()
      serializer = ProductSerializer(instance=products,many=True)
    except exceptions.ObjectDoesNotExist:
        return Response({'error':'product not found'})
    
    return Response(serializer.data)
  
@api_view(['GET'])
def get_product_detail(request,id):
    try:
      products = Product.objects.get(id = id)
      serializer = ProductSerializer(instance=products,many=False)
    except exceptions.ObjectDoesNotExist:
        return Response({'error':'product not found'})
    
    return Response(serializer.data)
  
class ProductCreateView(generics.CreateAPIView):
    serializer_class = ProductSerializer
    
    