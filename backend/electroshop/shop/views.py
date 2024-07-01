from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.contrib.auth import authenticate,login,logout


from . models import User,Product,Category

from . serializer import UserSerialezer,ProductSerializer,CategorySerializer

# Create your views here.

@api_view( ['GET'])
def index(request):

    products = Product.objects.all()
    print('produccts',products)
    
    serializer = ProductSerializer(instance=products,many=True)
    
    return Response(serializer.data)

@csrf_exempt
@api_view( ['GET'])
def sigin(request):
    email = request.POST.get('email')
    password = request.POST.get('password')
    print('email:',email,'password',password)

    # print('produccts',products)
    
    # serializer = ProductSerializer(instance=products,many=True)
    
    return Response('successfull')
    
    
@csrf_exempt
def signup(request):
    products = Product.objects.all()
    print('produccts',products)
    
    serializer = ProductSerializer(instance=products,many=True)
    
    
    return Response(serializer.data)
    

@api_view( ['PUT'])
def product_list(request):
    products = Product.objects.filter(product_status ='published',featured = True)
    
    serializer = ProductSerializer(instance=products,many=True)
    return Response(serializer.data)#product list.html

@api_view( ['GET'])
def category_list(request):
   
    categories = Category.objects.all()
    serializer = CategorySerializer(instance=categories,many=False)
    
    return Response(serializer.data)