from django.shortcuts import render,redirect
from rest_framework import generics,status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models.functions import TruncMonth
from django.shortcuts import get_object_or_404
from django.db.models import Count,Sum
from rest_framework.views import APIView




from .models import Order,OrderItem
from cart.models import Cart
from users.models import CustomUser,Address

from .serializers import OrderSerializer
from payments.serializers import PaymentSerializer
from payments.models import Payment

# Create your views here.

class CheckoutView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer
    def post(self,request,*args,**kwargs):
        try:
            total_price = request.data['total_price']
            cart = Cart.objects.get(user = request.user)
            order= Order.objects.create(user = request.user,total_price=total_price)
            for item in cart.items.all():
               print('for loop')
               OrderItem.objects.create(order=order,product=item.product,quantity = item.quantity)
            serializer = self.get_serializer(order)
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        except Cart.DoesNotExist:
            return Response({"error":"Cart doesn't exist"},status=status.HTTP_404_NOT_FOUND)
        
    

class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]  

    def get_queryset(self):
        print('user is ',self.request.user)
        user = self.request.user
        
        if user.role == 'admin':
            return Order.objects.all()  
        elif user.role == 'customer':
            return Order.objects.filter(user=user)  
        return Order.objects.none() 

    def get(self, request, *args, **kwargs):
        print('hello i am called')
        orders = self.get_queryset()
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)




class UserOrderStatusListView(generics.ListAPIView):
    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')
        user = get_object_or_404(CustomUser, id=user_id)
        
        print('user id',user.id)
        order =  Order.objects .filter(user=user).annotate(month=TruncMonth('created_at')).values('month', 'status') .annotate(count=Count('id')).order_by('month', 'status')
        print('order found is',order)
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
            print('count',count)

            if month not in data:
                data[month] = {}
            data[month][status] = count
            print('data',data)

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
            print('response data',response_data)
        return Response(response_data)
    
class UserSalesChartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.query_params.get('user_id')
        
        if not user_id:
            return Response({"error": "User ID is required."}, status=400)

        # Filter orders for the specific user and aggregate total sales by month
        sales_data = (
            Order.objects
            .filter(user_id=user_id)
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
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    queryset = Order.objects.all()

    def get_object(self):
        try:
            print('order id',self.kwargs['order_id'])
            print('object is called')
            return Order.objects.get(id=self.kwargs['order_id'])
        except Order.DoesNotExist:
            return Response({'error': 'Order Not found'}, status=status.HTTP_404_NOT_FOUND)

    def get(self, request, *args, **kwargs):
            order = self.get_object()
            print('order is',order)
            serializer = self.get_serializer(order)
            return Response(serializer.data)
        

class OrderUpdateView(generics.UpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    

    def put(self, request, *args, **kwargs):
        try:
            order_id = self.kwargs['order_id']
            order = Order.objects.get(id=order_id)
            address_id = request.data.get('address_id')
            if address_id:
                try:
                    address = Address.objects.get(id=address_id)
                    order.address = address
                    print('address',address)
                except Address.DoesNotExist:
                    return Response({'error': 'Address not found.'}, status=status.HTTP_404_NOT_FOUND)
            
            order.save()

            # Return the updated order data
            serializer = self.get_serializer(order)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Order.DoesNotExist:
            return Response({'error': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        
class ProcessPaymentView(generics.GenericAPIView):
    queryset = Order.objects.all()

    def post(self, request, *args, **kwargs):
        try:
            order = self.get_object()
            # Check if payment info is set
            if not order.payment_method or not order.payment_gateway:
                return Response({'error': 'Payment information is missing.'}, status=status.HTTP_400_BAD_REQUEST)

            # Process payment using stored payment method and gateway
            payment_data = process_payment(order, order.payment_method, order.payment_gateway)
            if payment_data is None:
                return Response({'error': 'Payment processing failed.'}, status=status.HTTP_400_BAD_REQUEST)

            # If payment is successful, save the transaction ID
            if not order.payment:
                # Create and associate a new payment record if needed
                payment = Payment(...,order=order, transaction_id=payment_data['transaction_id'])
                payment.save()
                order.payment = payment
            
            order.payment.transaction_id = payment_data['transaction_id']
            order.payment.save()

            return Response({'message': 'Payment processed successfully.', 'transaction_id': payment_data['transaction_id']}, status=status.HTTP_200_OK)

        except Order.DoesNotExist:
            return Response({'error': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class OrderCancelView(generics.DestroyAPIView):
    serializer_class = OrderSerializer
    queryset = Order.objects.all()