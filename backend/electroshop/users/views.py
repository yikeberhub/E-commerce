from django.shortcuts import render

from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.decorators import api_view,permission_classes
from rest_framework import generics,permissions,status,serializers
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import exceptions

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .serializers import UserSerializer, RegisterSerializer,LoginSerializer,AddressSerializer,set_default_address
from .models import CustomUser,Address



# Create your views here.
class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        print('i am called')
        print('request.data',request.data)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)  
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class CreateAddressView(generics.CreateAPIView):
    queryset= Address.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = AddressSerializer
   
    
    def post(self,request,*args,**kwargs):    
        print('hello man')       
        print('user',request.user)          
        try:
            user = CustomUser.objects.get(id = request.user.id)
            address= Address.objects.create(user = user,**request.data)
            serializer =AddressSerializer(address)
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        except CustomUser.DoesNotExist:
            return Response({"error":"user not exist"},status=status.HTTP_404_NOT_FOUND)
    
class UpdateAddressView(generics.UpdateAPIView):
     queryset= Address.objects.all()
     permission_classes = [IsAuthenticated]
     serializer_class = AddressSerializer
      
     def get_object(self):
        print('get object is called')
        try:
            address =Address.objects.get(id = self.kwargs['pk'])
            return address
        except Address.DoesNotExist:
            raise exceptions.NotFound('Address not Found')
        

     def put(self, request, *args, **kwargs):
            try:
                address = self.get_object()
                serializer = self.get_serializer(address,data=request.data,partial = True)
                serializer.is_valid(raise_exception=True) 
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                print('serializer error')
                return Response(serializer.errors,status=400)
            except Exception as e:
                print('Error encountered',str(e))
                return Response({'error':str(e)},status=500)
            
class SetDefaultAddrerssView(generics.UpdateAPIView):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]
    
    def put(self,request,*args,**kwargs):
        address_id = self.kwargs['pk']
        user = request.user
        data=set_default_address(address_id,user)
        if data:
            serializer = self.get_serializer(data)
            return Response({'address':serializer.data},status=status.HTTP_200_OK)
        return Response({'message':'Error in set default'},status=status.HTTP_304_NOT_MODIFIED)
        
        
    
      
class AddressDeleteView(generics.DestroyAPIView):
    serializer_class=AddressSerializer
    permission_classes =[IsAuthenticated]
    
    def delete(self,request,*args,**kwargs):
        try:
            print('i am called',self.kwargs['pk'])
            address=Address.objects.get(id=self.kwargs['pk'])
            if address:
                print('there is address')
                address.delete()
                return Response({'message':'successfully deleted'},status=status.HTTP_200_OK)
            else:
                return Response({'message':'message id not found'},status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print('Error:',str(e))
            return Response({'error':str(e)},status=500)
    
    

class UserUpdateView(generics.UpdateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserSerializer
    
    def get_object(self):
        print('get object is called')
        try:
            user =CustomUser.objects.get(id = self.kwargs['pk'])
            print('object user is',user)
            return user
        except CustomUser.DoesNotExist:
            raise exceptions.NotFound('User not Found')
        

    def put(self, request, *args, **kwargs):
        try:
            user = self.get_object()
            serializer = self.get_serializer(user,data=request.data,partial = True)
            serializer.is_valid(raise_exception=True) 
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors,status=400)
        except Exception as e:
            print('Error encountered',str(e))
            return Response({'error':str(e)},status=500)
    
class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer
    
    def post(self,request,*args,**kwargs):
        serializer = self.get_serializer(data = request.data)
        print('i am called here')
        try:
           serializer.is_valid(raise_exception = True)
        except serializers.ValidationError as e:
            error_messages = []
            for field,messages in e.detail.items():
                for message in messages:
                    error_messages.append({
                        'field':field,
                        'message':message,
                        'code':e.get_codes().get(field) or 'unknown'
                    })
            
            print('message:',error_messages[0]['field'])
            return Response({
                'errors':error_messages
            },status=status.HTTP_400_BAD_REQUEST)
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh':str(refresh),
            'access':str(refresh.access_token)
        })

class LogoutView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self,request):
        return Response (status=204)
    
class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)

def password_change(request):
    pass

def password_reset(request):
    pass
 
