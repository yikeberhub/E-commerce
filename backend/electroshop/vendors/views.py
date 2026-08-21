from django.shortcuts import render
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated


from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Vendor
from .serializer import VendorSerializer
from orders.models import Order,OrderItem
from orders.serializers import OrderSerializer
from products.serializers import ProductSerializer
from products.models import Product
from electroshop.permissions import IsAdmin, IsOwnerOrAdminOrReadOnly


# List and Create Vendors
class VendorListView(generics.ListCreateAPIView):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer

    def get_permissions(self):
        # Anyone can browse the vendor list; only an admin can create a
        # vendor directly here (normal onboarding goes through
        # VendorRegistrationView, which ties the vendor to its own user).
        if self.request.method == 'POST':
            return [IsAuthenticated(), IsAdmin()]
        return [AllowAny()]

# Retrieve, Update, and Delete Vendor
class VendorDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Vendor.objects.all()
    permission_classes = [IsOwnerOrAdminOrReadOnly]
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
    
    
class VendorOrdersView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        return Order.objects.filter(vendor_id=vendor_id)

    def list(self, request, *args, **kwargs):
        vendor = generics.get_object_or_404(Vendor, id=self.kwargs['vendor_id'])
        if vendor.user_id != request.user.id and request.user.role != 'admin':
            return Response({'error': 'Not authorized to view this vendor\'s orders.'}, status=status.HTTP_403_FORBIDDEN)
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "vendor": vendor.title,
            "orders": serializer.data
        })



class VendorProductsView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        print('vendor id is ',vendor_id)
        return Product.objects.filter(vendor=vendor_id)

    def list(self, request, *args, **kwargs):
        vendor = generics.get_object_or_404(Vendor, id=self.kwargs['vendor_id'])
        queryset = self.get_queryset()
        print('query set is ',queryset)
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "vendor": vendor.title,
            "products": serializer.data
        })