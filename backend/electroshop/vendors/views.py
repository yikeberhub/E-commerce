from django.shortcuts import render
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated


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
 
 
 
class VendorRegistrationView(generics.CreateAPIView):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
    permission_classes = [IsAuthenticated]  # Ensure that only authenticated users can register

    def perform_create(self, serializer):
        # Save the vendor with the authenticated user and set is_active to False
        vendor = serializer.save(user=self.request.user, is_active=False)
        return vendor

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data,partial=True)
        serializer.is_valid(raise_exception=True)  # This will raise a ValidationError if invalid
        self.perform_create(serializer)
        
        # Return a successful response
        return Response(serializer.data, status=status.HTTP_201_CREATED)