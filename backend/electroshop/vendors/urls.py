# vendors/urls.py
from django.urls import path
from .views import VendorListView, VendorDetailView,VendorRegistrationView,VendorProductsView,VendorOrdersView

urlpatterns = [
    path('', VendorListView.as_view(), name='vendor-list'),  
    path('<int:pk>/', VendorDetailView.as_view(), name='vendor-detail'),  
    path('register/',VendorRegistrationView.as_view(),name='vendor-register'),
    path('<int:vendor_id>/orders/', VendorOrdersView.as_view(), name='vendor-orders'),
    path('<int:vendor_id>/products/', VendorProductsView.as_view(), name='vendor-products'),
]