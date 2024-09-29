from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import index,getProducts,category_list,signup,login,user_profile,CustomTokenObtainPairView

urlpatterns = [
    path('',index,name='products'),
    path('signup/',signup,name='signup'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('user-profile/',user_profile,name='user-profile'),
    
    path('get-products/',getProducts,name='get-products'),
    path('category /',category_list,name='category')
]