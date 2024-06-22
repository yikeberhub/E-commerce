from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view

from . models import User,Product

from . serializer import UserSerialezer,ProductSerializer

# Create your views here.

@api_view( ['GET'])
def getProducts(request):
    pass
    # product = Product.objects.all()
    # serializer = ProductSerializer(instance=product,many=True)
    
    # return Response(serializer.data)

@api_view( ['GET'])
def getProduct(request,pk):
    pass
    # product = Product.objects.get(id=pk)
    # serializer = ProductSerializer(instance=product,many=False)
    
    # return Response(serializer.data)