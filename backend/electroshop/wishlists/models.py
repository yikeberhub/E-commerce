from django.db import models
from products.models import Product
from users.models import CustomUser

# Create your models here.
    
class Wishlist(models.Model):
    user = models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f'wishlist for user {self.user.username}'
    
class WishlistItem(models.Model):
    wishlist = models.ForeignKey(Wishlist,related_name='items',on_delete=models.CASCADE)
    product = models.ForeignKey(Product,related_name='product_items',on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    
    
    class Meta:
        unique_together = ('wishlist','product')
        
    def __str__(self):
        return f'{self.quantity} of {self.product.title} in wishlist {self.wishlist.id}'
    
    