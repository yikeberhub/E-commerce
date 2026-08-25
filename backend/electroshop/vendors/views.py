from django.shortcuts import render
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound


from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum, Count, Avg
from django.db.models.functions import TruncMonth
from .models import Vendor
from .serializer import VendorSerializer, MyVendorSerializer, VendorProfileUpdateSerializer
from orders.models import Order,OrderItem
from orders.serializers import OrderSerializer
from products.serializers import ProductSerializer
from products.models import Product, ProductReview
from electroshop.permissions import IsAdmin, IsOwnerOrAdminOrReadOnly


class MyVendorView(generics.RetrieveAPIView):
    """Returns the authenticated user's own vendor profile."""
    serializer_class = MyVendorSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        vendor = Vendor.objects.filter(user=self.request.user).first()
        if vendor is None:
            raise NotFound("You don't have a vendor profile.")
        return vendor


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

    def get_serializer_class(self):
        is_write = self.request.method in ('PUT', 'PATCH')
        if is_write and self.request.user.role != 'admin':
            return VendorProfileUpdateSerializer
        return VendorSerializer
 
 
 
class VendorRegistrationView(generics.CreateAPIView):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
    permission_classes = [IsAuthenticated]  # Ensure that only authenticated users can register

    def perform_create(self, serializer):
        # Save the vendor with the authenticated user and set is_active to False
        vendor = serializer.save(user=self.request.user, is_active=False)
        if self.request.user.role != 'vendor':
            self.request.user.role = 'vendor'
            self.request.user.save(update_fields=['role'])
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


class VendorAnalyticsView(APIView):
    """Revenue trend, order-status breakdown, and top products for the
    authenticated vendor's own store."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        vendor = Vendor.objects.filter(user=request.user).first()
        if not vendor and request.user.role != 'admin':
            return Response({'error': 'You do not have a vendor profile.'}, status=status.HTTP_403_FORBIDDEN)

        orders = Order.objects.filter(vendor=vendor) if vendor else Order.objects.all()

        revenue_by_month = (
            orders.annotate(month=TruncMonth('created_at'))
            .values('month')
            .annotate(total=Sum('total_price'))
            .order_by('month')
        )
        revenue_trend = [
            {'month': row['month'].strftime('%b %Y'), 'total': float(row['total'] or 0)}
            for row in revenue_by_month
        ]

        status_breakdown = list(
            orders.values('status').annotate(count=Count('id')).order_by('-count')
        )

        products_qs = Product.objects.filter(vendor=vendor) if vendor else Product.objects.all()
        top_products = (
            OrderItem.objects.filter(order__in=orders, product__in=products_qs)
            .values('product__id', 'product__title')
            .annotate(units_sold=Sum('quantity'))
            .order_by('-units_sold')[:5]
        )

        rating_avg = ProductReview.objects.filter(product__in=products_qs).aggregate(avg=Avg('rating'))['avg']

        return Response({
            'summary': {
                'total_revenue': float(orders.exclude(status__in=['pending', 'payment_processing', 'payment_failed', 'canceled']).aggregate(t=Sum('total_price'))['t'] or 0),
                'total_orders': orders.count(),
                'total_products': products_qs.count(),
                'average_rating': round(rating_avg, 2) if rating_avg else None,
                'balance': float(vendor.balance) if vendor else None,
            },
            'revenue_trend': revenue_trend,
            'status_breakdown': status_breakdown,
            'top_products': [
                {'id': row['product__id'], 'title': row['product__title'], 'units_sold': row['units_sold']}
                for row in top_products
            ],
        })