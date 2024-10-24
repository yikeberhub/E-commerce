from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Vendor
from .serializer import VendorSerializer

# List and Create Vendors
class VendorListView(generics.ListCreateAPIView):
    queryset = Vendor.objects.all()
    permission_classes = [AllowAny]
    serializer_class = VendorSerializer

# Retrieve, Update, and Delete Vendor
class VendorDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Vendor.objects.all()
    permission_classes = [AllowAny]  
    serializer_class = VendorSerializer