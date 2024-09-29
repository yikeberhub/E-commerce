from django.shortcuts import get_object_or_404
from rest_framework import status,generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

from .models import Cart, CartItem
from users.models import CustomUser
from products.models import Product
from .serializers import CartSerializer, CartItemSerializer

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def cart_view(request):
    cart = Cart.objects.get(user=request.user)

    if request.method == 'GET':
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    return Response(status=status.HTTP_400_BAD_REQUEST)

    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cartAddView(request):  
    product_id = request.data['product_id']
    product = Product.objects.get(id = product_id)
    user = request.user
    print('user:',user,'product:',product)
    cart = Cart.objects.get(user = user)
    cart_item = CartItem.objects.get_or_create(cart= cart,product = product,quantity = request.data['quantity'])
    serializer = CartSerializer(instance=cart)
    if serializer.data:
       return Response({'data':serializer.data})
    return Response({'errors':serializer.errors})


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def cart_update_view(request, pk):
    if request.user:
        cart_item = get_object_or_404(CartItem, id=pk, cart__user=request.user)
        serializer = CartItemSerializer(cart_item, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
    
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def cart_remove_view(request, pk):
    if request.user:
        cart = Cart.objects.get(user = request.user)
        try:
          cart_item = CartItem.objects.get(id =pk,cart = cart)
          cart_item.delete()
          return Response({'message':'deleted successfully'})
        except:
            return Response({'error':'fail to delete item'})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def cart_clear_view(request):
    cart = get_object_or_404(Cart, user=request.user)
    cart.items.all().delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
    
