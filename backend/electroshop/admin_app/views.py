# admin_app/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum,Count
from orders.models import Order
from products.models import Product
from vendors.models import Vendor
from users.models import CustomUser 

from users.serializers import UserSerializer

class SuperAdminDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'admin':
            print('user is not admin')
            return Response({'error': 'Unauthorized'}, status=403)

        # Fetch total metrics
        total_vendors = Vendor.objects.count()
        total_users = CustomUser.objects.count()
        total_products = Product.objects.count()
        total_orders = Order.objects.count()
        total_sales = Order.objects.aggregate(total=Sum('total_price'))['total'] or 0 

        # Fetch sales trends (example data structure)
        sales_trends = (
            Order.objects.values('created_at__date')
            .annotate(amount=Sum('total_price'))
            .order_by('created_at__date')
        )
        sales_trends_data = [{'date': str(item['created_at__date']), 'amount': float(item['amount'])} for item in sales_trends]

        # Fetch order distribution
        order_distribution = (
            Order.objects.values('status')
            .annotate(count=Count('id'))
        )
        order_distribution_data = [{'status': item['status'], 'count': item['count']} for item in order_distribution]

        # Combine all data into a single response
        data = {
            'totalVendors': total_vendors,
            'totalUsers': total_users,
            'totalProducts': total_products,
            'totalOrders': total_orders,
            'totalSales': f"{total_sales:.2f}",
            'salesTrends': sales_trends_data,
            'orderDistribution': order_distribution_data,
        }

        return Response(data)

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    
class VendorAdminDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_vendor:  # Check if the user is a vendor admin
            return Response({'error': 'Unauthorized'}, status=403)

        total_products = Product.objects.filter(vendor=request.user.vendor).count()
        total_orders = Order.objects.filter(product__vendor=request.user.vendor).count()
        total_sales = Order.objects.filter(product__vendor=request.user.vendor).aggregate(total=Sum('amount'))['total'] or 0

        data = {
            'totalProducts': total_products,
            'totalOrders': total_orders,
            'totalSales': f"{total_sales:.2f}",
        }

        return Response(data)