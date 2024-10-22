from django.shortcuts import render,redirect
from rest_framework import generics,status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Order,OrderItem
from cart.models import Cart
from users.models import CustomUser,Address

from payments .process_payment import process_payment
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
            return Order.objects.filter(customer_name=user.username)  
        return Order.objects.none() 

    def get(self, request, *args, **kwargs):
        print('hello i am called')
        orders = self.get_queryset()
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)
    
 
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