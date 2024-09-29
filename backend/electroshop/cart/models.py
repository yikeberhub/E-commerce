from django.db import models

from users.models import CustomUser
from products.models import Product

# Create your models here.
class Cart(models.Model):
    user = models.OneToOneField(CustomUser,on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
         
    def __str__(self):
        return f"cart for user {self.user.username}"
    

class CartItem(models.Model):
    cart = models.ForeignKey(Cart,related_name='items',on_delete=models.CASCADE)
    product = models.ForeignKey(Product,related_name='items',on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    
    
    class Meta:
        unique_together = ('cart','product')
        
    def __str__(self):
        return f'{self.quantity} of {self.product.title} in Cart {self.cart.id}'
