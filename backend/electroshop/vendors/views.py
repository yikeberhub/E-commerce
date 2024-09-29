from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Vendor
from .serializer import VendorSerializer

class VendorListView(generics.ListCreateAPIView):
   
    queryset = Vendor.objects.all()
    permission_classes = [AllowAny]
    serializer_class = VendorSerializer

    def get(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)  # This will raise a 400 error with specific messages if validation fails
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class VendorDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = VendorSerializer
    queryset = Vendor.objects.all()

class VendorCreateView(generics.CreateAPIView):
    queryset = Vendor.objects.all()
    permission_classes = [AllowAny]
    serializer_class = VendorSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)  # This will raise a 400 error with specific messages if validation fails
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

        


class VendorUpdateView:
    pass

class VendorDeleteView:
    pass
