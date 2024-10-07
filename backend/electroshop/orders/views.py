from django.shortcuts import render,redirect
from rest_framework import generics,status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Order,OrderItem
from cart.models import Cart

from .serializers import OrderSerializer
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
            print('order,',order)
            serializer = self.get_serializer(order)
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        except Cart.DoesNotExist:
            return Response({"error":"Cart doesn't exist"},status=status.HTTP_404_NOT_FOUND)
        
    

class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer

    def get_queryset(self):
        user = self.request.user
        return Order.objects.filter(user=user)
    
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
    serializer_class = OrderSerializer
    queryset = Order.objects.all()

class OrderCancelView(generics.DestroyAPIView):
    serializer_class = OrderSerializer
    queryset = Order.objects.all()