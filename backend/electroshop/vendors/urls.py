# vendors/urls.py
from django.urls import path
from .views import (
    VendorListView, VendorDetailView, 
    VendorCreateView, VendorUpdateView, VendorDeleteView
)

urlpatterns = [
    path('', VendorListView.as_view(), name='vendor-list'),
    path('/<int:id>/', VendorDetailView.as_view(), name='vendor-detail'),
    path('/create/', VendorCreateView.as_view(), name='vendor-create'),
    path('/update/<int:id>/', VendorUpdateView.as_view(), name='vendor-update'),
    path('/delete/<int:id>/', VendorDeleteView.as_view(), name='vendor-delete'),
]