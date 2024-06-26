from django.urls import path

from .views import index,product_list,category_list

urlpatterns = [
    path('',index,name='products'),
    path('products/',product_list,name='product'),
    path('category /',category_list,name='category')
]