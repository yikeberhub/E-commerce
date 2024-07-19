import json
from django.shortcuts import redirect, render
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view,permission_classes
from rest_framework import status

# from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.decorators import login_required
from django.middleware.csrf import get_token



from . models import User,Product,Category

from . serializer import UserSerialezer,ProductSerializer,CategorySerializer

# Create your views here.
@api_view(['GET'])
def getToken(request):
     csrf_token = get_token(request)
     token = {
        'csrf_token': csrf_token
        }
     print('token:',token)
     return Response(token)

    
@api_view(['POST'])
# @permission_classes([IsAuthenticated])
def getUser(request):
    if request.method =='POST':
         data = json.loads(request.body)
         user_id = str(data)
         user = User.objects.get(id=user_id)
         user_serializer = UserSerialezer(instance=user,many =False)
         user_data = user_serializer.data
         data = {'success': True,'user':user_data, 'message': 'Login successful'}
         return Response(data, status=status.HTTP_200_OK)
    else:
        return Response({'success':False,'message':'Invalid request'},status=status.HTTP_405_METHOD_NOT_ALLOWED)
         
@api_view(['GET'])
def getProducts(request):
    products = Product.objects.all()
    print('produccts',products)
    serializer = ProductSerializer(instance=products,many=True)
    return Response(serializer.data)

@api_view(['GET'])
def index(request):
    products = Product.objects.all()
    serializer = ProductSerializer(instance=products, many=True)
    products_data = serializer.data
    csrf_token = get_token(request)
    data = {
        'products': products_data,
        'csrf_token': csrf_token
    }
    print('token:',csrf_token)
    return Response(data)


@api_view(['POST'])
def signIn(request):
    if request.method =='POST':
        data = json.loads(request.body)
        email = data['email']
        password = data['password']
        user = authenticate(username='yike',password='yike123')
        print('username:', 'yike', 'password', password)
        if user is not None:
            login(request,user=user )
            refresh = RefreshToken.for_user(user)
            token = str(refresh.access_token)
            print('refresh token is :',str(refresh.access_token))
            user_serializer = UserSerialezer(instance=user,many=False)
            user_data = user_serializer.data
            print('user data is :',user_data)
            data = {'success': True,'user':user_data,'token':token,'refresh':str(refresh), 'message': 'Login successful'}
            return Response(data, status=status.HTTP_200_OK)
            # return redirect('/')
        else:
            
            print('user not found')
            return Response({'success':False,'message':'login failed'},status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)
            
        
        

    # Perform your login logic here
    # ...

    # Return a JSON response
        
    

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