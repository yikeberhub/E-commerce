# vendors/urls.py
from django.urls import path
from .views import (
    VendorListView, VendorDetailView,VendorRegistrationView,VendorProductsView,VendorOrdersView,
    MyVendorView,VendorAnalyticsView,VendorSubscriptionListCreateView,
)

urlpatterns = [
    path('', VendorListView.as_view(), name='vendor-list'),
    path('me/', MyVendorView.as_view(), name='vendor-me'),
    path('analytics/', VendorAnalyticsView.as_view(), name='vendor-analytics'),
    path('<int:pk>/', VendorDetailView.as_view(), name='vendor-detail'),
    path('register/',VendorRegistrationView.as_view(),name='vendor-register'),
    path('<int:vendor_id>/orders/', VendorOrdersView.as_view(), name='vendor-orders'),
    path('<int:vendor_id>/products/', VendorProductsView.as_view(), name='vendor-products'),
    path('<int:vendor_id>/subscription/', VendorSubscriptionListCreateView.as_view(), name='vendor-subscription'),
]