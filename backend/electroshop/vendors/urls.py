# vendors/urls.py
from django.urls import path
from .views import VendorListView, VendorDetailView

urlpatterns = [
    path('', VendorListView.as_view(), name='vendor-list'),  # List and Create
    path('<int:pk>/', VendorDetailView.as_view(), name='vendor-detail'),  # Retrieve, Update, Delete
]