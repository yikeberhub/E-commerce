from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import ProfileView,UserUpdateView,RegisterView,LoginView,LogoutView,password_change,password_reset
# 
urlpatterns = [
    path('',ProfileView.as_view(),name='user_profile'),
    path('register/',RegisterView.as_view(),name='register'),
    path('login/',LoginView.as_view(),name='login'),
    path('<int:pk>/update/',UserUpdateView.as_view(),name='update'),
    path('token/refresh',TokenRefreshView.as_view(),name='refresh'),
    path('logout/',LogoutView.as_view(),name='logout'),
    path('password_change/',password_change,name='password_change'),
    path('password_reset/',password_reset,name='password_reset'),
    
]