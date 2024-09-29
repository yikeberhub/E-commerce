from django.shortcuts import get_object_or_404
from rest_framework import status,generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

from .models import Wishlist, WishlistItem
from users.models import CustomUser
from products.models import Product
from .serializers import WishlistItemSerializer, WishlistSerializer

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def wishlist_view(request):
    wishlist = Wishlist.objects.get(user=request.user)

    if request.method == 'GET':
        serializer = WishlistSerializer(wishlist)
        return Response(serializer.data)
    return Response(status=status.HTTP_400_BAD_REQUEST)

    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def wishlist_add(request):  
    product_id = request.data['product_id']
    product = Product.objects.get(id = product_id)
    user = request.user
    print('user:',user,'product:',product)
    wishlist = Wishlist.objects.get(user = user)
    wishlist_item = WishlistItem.objects.get_or_create(wishlist= wishlist,product = product)
    serializer = WishlistSerializer(instance=wishlist)
    if serializer.data:
       return Response({'data':serializer.data})
    return Response({'errors':serializer.errors})


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def wishlist_update_view(request, pk):
    if request.user:
        wishlist_item = get_object_or_404(WishlistItem, id=pk, wishlist__user=request.user)
        serializer = WishlistItem(wishlist_item, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
    
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def wishlist_remove_view(request, pk):
    if request.user:
        wishlist = Wishlist.objects.get(user = request.user)
        try:
          wishlist_item = WishlistItem.objects.get(id =pk,wishlist = wishlist)
          wishlist_item.delete()
          return Response({'message':'deleted successfully'})
        except:
            return Response({'error':'fail to delete item'})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def wishlist_clear_view(request):
    wishlist = get_object_or_404(Wishlist, user=request.user)
    wishlist.items.all().delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
    
