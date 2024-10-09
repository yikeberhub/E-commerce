from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import ProfileView,UserUpdateView,RegisterView,AddressDeleteView,SetDefaultAddrerssView,LoginView,LogoutView,CreateAddressView,UpdateAddressView,password_change,password_reset
# 
urlpatterns = [
    path('',ProfileView.as_view(),name='user-profile'),
    path('register/',RegisterView.as_view(),name='register'),
    path('login/',LoginView.as_view(),name='login'),
    path('<int:pk>/update/',UserUpdateView.as_view(),name='update-user'),
    path('token/refresh',TokenRefreshView.as_view(),name='refresh'),
    path('address/create/',CreateAddressView.as_view(),name='create-address'),
    path('address/<int:pk>/update/',UpdateAddressView.as_view(),name='update-address'),
    path('address/<int:pk>/set-default/',SetDefaultAddrerssView.as_view(),name='set-default-address'),
    path('address/<int:pk>/delete/',AddressDeleteView.as_view(),name='delete-address'),
    path('token/refresh',TokenRefreshView.as_view(),name='refresh'),
    path('logout/',LogoutView.as_view(),name='logout'),
    path('password_change/',password_change,name='password-change'),
    path('password_reset/',password_reset,name='password-reset'),
    
]