from django.shortcuts import render,redirect
from rest_framework import generics,status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound, APIException
from django.http import Http404
from rest_framework.response import Response
from django.db.models.functions import TruncMonth
from django.shortcuts import get_object_or_404
from django.db.models import Count,Sum
from rest_framework.views import APIView
from collections import defaultdict
import logging
import uuid
from .models import Order,OrderItem,ORDER_STATUS
from cart.models import Cart
from users.models import CustomUser,Address
from vendors.models import Vendor

from .serializers import OrderSerializer,OrderDetailSerializer
from payments.serializers import PaymentSerializer
from payments.models import Payment
from electroshop.permissions import IsOwnerOrAdmin
from notifications.utils import notify
logger = logging.getLogger(__name__)


class CheckoutView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def post(self, request, *args, **kwargs):
        try:
            total_price = request.data.get('total_price')
            if total_price is None:
                return Response({"error": "Total price is required."}, status=status.HTTP_400_BAD_REQUEST)

            # Check if cart exists for the user
            cart = Cart.objects.get(user=request.user)
            vendor_orders = defaultdict(list)

            # Group cart items by vendor
            for item in cart.items.all():
                vendor_orders[item.product.vendor].append(item)

            orders = []
            order_ids = []

            for vendor, items in vendor_orders.items():
                vendor_total = sum(item.product.price * item.quantity for item in items)

                # Create an order for each vendor
                order = Order.objects.create(
                    user=request.user,
                    total_price=vendor_total,
                    vendor=vendor
                )

                # Add items to the order
                for item in items:
                    OrderItem.objects.create(order=order, product=item.product, quantity=item.quantity)

                # Generate a unique transaction ID
                transaction_id = str(uuid.uuid4())

                # Create a Payment record for the order
                try:
                    Payment.objects.create(
                        order=order,
                        amount=vendor_total,
                        payment_status='pending',
                        transaction_id=transaction_id
                    )
                except Exception as payment_error:
                    logger.exception('Payment creation failed for order %s', order.id)
                    return Response({"error": "Payment creation failed."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                orders.append(order)
                order_ids.append(order.id)

                if vendor and vendor.user:
                    try:
                        notify(
                            recipient=vendor.user,
                            notification_type='order',
                            title=f'New order #{order.id}',
                            message=f'{request.user.username} placed an order worth {vendor_total} ETB.',
                            link=f'/vendor-dashboard/orders',
                        )
                    except Exception:
                        pass

            # The cart's contents are now committed to orders — clear it.
            cart.items.all().delete()

            # Serialize orders
            serialized_orders = [OrderSerializer(order).data for order in orders]
            return Response({
                "orders": serialized_orders,
                "order_ids": order_ids
            }, status=status.HTTP_201_CREATED)

        except Cart.DoesNotExist:
            return Response({"error": "Cart doesn't exist."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.exception('Checkout failed for user %s', request.user.id)
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        
class OrderListView(generics.ListAPIView):
    serializer_class = OrderDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == 'admin':
            return Order.objects.all()
        elif user.role == 'vendor':
            vendor = Vendor.objects.filter(user=user).first()
            return Order.objects.filter(vendor=vendor) if vendor else Order.objects.none()
        elif user.role == 'customer':
            return Order.objects.filter(user=user)
        else:
            return Order.objects.none()


    def get(self, request, *args, **kwargs):
        orders = self.get_queryset()
        serializer = self.get_serializer(orders, many=True,context={'request':request})
        return Response(serializer.data)




class UserOrderStatusListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')
        if user_id and self.request.user.role == 'admin':
            user = get_object_or_404(CustomUser, id=user_id)
        else:
            user = self.request.user

        order =  Order.objects .filter(user=user).annotate(month=TruncMonth('created_at')).values('month', 'status') .annotate(count=Count('id')).order_by('month', 'status')
        return (
           order
        )

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        data = {}

        for order in queryset:
            month = order['month'].strftime("%B")
            status = order['status']
            count = order['count']

            if month not in data:
                data[month] = {}
            data[month][status] = count

        # Prepare the response data
        response_data = []
        for month, statuses in data.items():
            response_data.append({
                'month': month,
                'pending': statuses.get('pending', 0),
                'completed': statuses.get('completed', 0),
                'payment_failed': statuses.get('payment_failed', 0),
                'processing': statuses.get('processing', 0),
            })
        return Response(response_data)
    
class UserSalesChartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.query_params.get('user_id')
        if user_id and request.user.role == 'admin':
            target_user_id = user_id
        else:
            target_user_id = request.user.id

        # Filter orders for the specific user and aggregate total sales by month
        sales_data = (
            Order.objects
            .filter(user_id=target_user_id)
            .annotate(month=TruncMonth('created_at'))  # Group by month
            .values('month')
            .annotate(total_sales=Sum('total_price'))  # Sum total price
            .order_by('month')  # Order by month
        )

        # Transform the data to the desired format
        result = []
        for sale in sales_data:
            result.append({
                "month": sale['month'].strftime('%B %Y'),  # Format month as "January 2023"
                "total_sales": float(sale['total_sales'] or 0),  # Ensure total sales is a float
            })

        return Response(result) 
    

class OrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = OrderDetailSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    queryset = Order.objects.all()

    def get_object(self):
        try:
            order_id = self.kwargs['order_id']
            order = Order.objects.get(id=order_id)
            self.check_object_permissions(self.request, order)
            return order
        except Order.DoesNotExist:
            raise NotFound('Order not found')

    def get(self, request, *args, **kwargs):
        order = self.get_object()
        serializer = self.get_serializer(order)
        return Response(serializer.data)

class OrderUpdateView(generics.UpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderDetailSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    lookup_url_kwarg = 'order_id'


# Statuses a vendor is allowed to move an order into, keyed by the order's
# current status. Payment-driven statuses (payment_failed, refunded) and
# post-cancellation states are deliberately not vendor-editable here.
VENDOR_STATUS_TRANSITIONS = {
    'pending': ['processing', 'canceled'],
    'payment_processing': ['processing', 'canceled'],
    'processing': ['shipped', 'canceled'],
    'shipped': ['delivered'],
    'delivered': ['completed'],
}

VALID_STATUSES = dict(ORDER_STATUS)


class OrderStatusUpdateView(generics.UpdateAPIView):
    """Lets the owning vendor (or an admin) move an order to its next
    fulfillment status, e.g. mark it processing/shipped/delivered."""
    queryset = Order.objects.all()
    serializer_class = OrderDetailSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    lookup_url_kwarg = 'order_id'

    def patch(self, request, *args, **kwargs):
        order = self.get_object()
        new_status = request.data.get('status')

        if not new_status:
            return Response({'detail': 'status is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if new_status not in VALID_STATUSES:
            return Response({'detail': 'Invalid status.'}, status=status.HTTP_400_BAD_REQUEST)

        if request.user.role != 'admin':
            allowed_next = VENDOR_STATUS_TRANSITIONS.get(order.status, [])
            if new_status not in allowed_next:
                return Response(
                    {'detail': f"Can't move an order from '{VALID_STATUSES[order.status]}' to '{VALID_STATUSES[new_status]}'."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        order.status = new_status
        order.save(update_fields=['status', 'updated_at'])

        try:
            notify(
                recipient=order.user,
                notification_type='order',
                title=f'Order #{order.id} is now {VALID_STATUSES[new_status].lower()}',
                message=f'Your order from {order.vendor.title if order.vendor else "the vendor"} was updated.',
                link=f'/user-dashboard/orders/{order.id}',
            )
        except Exception:
            pass

        serializer = self.get_serializer(order)
        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        try:
            order = self.get_object()
            address_id = request.data.get('address_id')
            if address_id:
                try:
                    address = Address.objects.get(id=address_id)
                    order.address = address
                except Address.DoesNotExist:
                    return Response({'error': 'Address not found.'}, status=status.HTTP_404_NOT_FOUND)
            
            order.save()

            # Return the updated order data
            serializer = self.get_serializer(order)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Order.DoesNotExist:
            return Response({'error': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)
        except (APIException, Http404):
            raise
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


CANCELABLE_STATUSES = {'pending', 'payment_processing', 'processing'}


class OrderCancelView(generics.DestroyAPIView):
    """Cancels an order by setting its status to 'canceled' rather than
    deleting it, so order history is preserved for the customer/vendor/admin."""
    serializer_class = OrderSerializer
    queryset = Order.objects.all()
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    lookup_url_kwarg = 'order_id'

    def destroy(self, request, *args, **kwargs):
        order = self.get_object()
        if order.status not in CANCELABLE_STATUSES:
            return Response(
                {'detail': f"An order that is already '{order.get_status_display()}' can't be canceled."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        order.status = 'canceled'
        order.save(update_fields=['status', 'updated_at'])

        other_party = (
            (order.vendor.user if order.vendor else None)
            if request.user == order.user
            else order.user
        )
        try:
            notify(
                recipient=other_party,
                notification_type='order',
                title=f'Order #{order.id} was canceled',
                message=f'{request.user.username} canceled order #{order.id}.',
            )
        except Exception:
            pass

        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)