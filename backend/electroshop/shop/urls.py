from django.urls import path

from .views import index,product_list,category_list,signup

urlpatterns = [
    path('',index,name='products'),
    path('signup/',signup,name='signup'),
    path('signin/',signup,name='signup'),
    
    path('products/',product_list,name='product'),
    path('category /',category_list,name='category')
]