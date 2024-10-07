from django.db import models
from users.models import CustomUser
from cart.models import Cart
from products.models import Product

# Create your models here.
class Order(models.Model):
    user = models.ForeignKey(CustomUser,on_delete= models.CASCADE)
    total_price = models.DecimalField(max_digits=10,decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=50,default='pending')
    paid = models.BooleanField(default=False)
    
    def __str__(self):
        return f'Order {self.id} by {self.user.username}'
    
class OrderItem(models.Model):
    order = models.ForeignKey(Order,related_name='items',on_delete=models.CASCADE)
    product = models.ForeignKey(Product,on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    
    def __str__(self):
        return f'item of {self.order.id} ordered by {self.order.user.username}'
        
