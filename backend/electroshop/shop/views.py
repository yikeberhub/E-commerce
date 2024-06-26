from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view

from . models import User,Product,Category

from . serializer import UserSerialezer,ProductSerializer,CategorySerializer

# Create your views here.

@api_view( ['GET'])
def index(request):
    
    products = Product.objects.filter(product_status ='published',featured = True)
    print('produccts',products)
    
    serializer = ProductSerializer(instance=products,many=True)
    
    return Response(serializer.data)

@api_view( ['GET'])
def product_list(request):
    products = Product.objects.filter(product_status ='published',featured = True)
    
    serializer = ProductSerializer(instance=products,many=True)
    return Response(serializer.data)#product list.html

@api_view( ['GET'])
def category_list(request):
   
    categories = Category.objects.all()
    serializer = CategorySerializer(instance=product,many=False)
    
    return Response(serializer.data)