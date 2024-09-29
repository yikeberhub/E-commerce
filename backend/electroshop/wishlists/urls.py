from django.urls import path
from .views import wishlist_view, wishlist_add, wishlist_update_view, wishlist_remove_view, wishlist_clear_view

urlpatterns = [
    path('', wishlist_view, name='wishlist'),
    path('add/', wishlist_add, name='add-to-wishlist'),
    path('update/<str:pk>/', wishlist_update_view, name='update-wishlist-item'),
    path('remove/<str:pk>/', wishlist_remove_view, name='remove-from-wishlist'),
    path('clear/', wishlist_clear_view, name='clear-wishlist'),
]