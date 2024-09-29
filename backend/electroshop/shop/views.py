import json
from django.shortcuts import redirect, render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view,permission_classes
from rest_framework import status
from django.contrib.auth.models import User

# from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.decorators import login_required
from django.middleware.csrf import get_token


from . models import User,Product,Category,Profile

from . serializer import UserSerializer,ProductSerializer,CategorySerializer,ProfileSerializer


from rest_framework_simplejwt.views import TokenObtainPairView
from .serializer import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    profile = Profile.objects.get(user =request.user)
    serializer = ProfileSerializer(profile)
    return Response(serializer.data)
 
@api_view(['GET'])
def getProducts(request):
    products = Product.objects.all()
    print('produccts',products)
    serializer = ProductSerializer(instance=products,many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])

def index(request):
    products = Product.objects.all()
    serializer = ProductSerializer(instance=products, many=True)
    products_data = serializer.data
    csrf_token = get_token(request)
    data = {
        'products': products_data,
        'csrf_token': csrf_token
    }
    return Response(data)



@api_view( ['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        print('data:',serializer.data)
        return Response(serializer.data)
                        
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

    
@api_view(['POST'])
def logout(request):
    if request.user.is_authenticated:
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)
    return Response({'error':'Not authenticated'
        },status=status.HTTP_400_BAD_REQUEST)



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