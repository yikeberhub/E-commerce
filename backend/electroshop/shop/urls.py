from django.urls import path

from .views import index,getProducts,category_list,signup,signIn,getUser,getToken

urlpatterns = [
    path('',index,name='products'),
    path('signup/',signup,name='signup'),
    path('signin/',signIn,name='signin'),
    path('get-user/',getUser,name='get-user'),
    path('getToken/',getToken,name='get-token'),
    
    path('get-products/',getProducts,name='get-products'),
    path('category /',category_list,name='category')
]