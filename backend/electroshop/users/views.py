from django.shortcuts import render

from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.decorators import api_view,permission_classes
from rest_framework import generics,permissions,status,serializers
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .serializers import UserSerializer, RegisterSerializer,LoginSerializer
from .models import CustomUser



# Create your views here.
class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)  # This will raise a 400 error with specific messages if validation fails
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer
    
    def post(self,request,*args,**kwargs):
        serializer = self.get_serializer(data = request.data)
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
        # print(refresh)
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
 
