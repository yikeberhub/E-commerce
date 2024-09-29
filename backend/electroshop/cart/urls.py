from django.urls import path
from .views import cart_view, cartAddView, cart_update_view, cart_remove_view, cart_clear_view

urlpatterns = [
    path('', cart_view, name='cart'),
    path('add/', cartAddView, name='add-to-cart'),
    path('update/<str:pk>/', cart_update_view, name='update-cart-item'),
    path('remove/<str:pk>/', cart_remove_view, name='remove-from-cart'),
    path('clear/', cart_clear_view, name='clear-cart'),
]