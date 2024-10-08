from django.db import models
from users.models import CustomUser,Address
from cart.models import Cart
from products.models import Product
from payments .models import Payment


ORDER_STATUS = [('pending','Pending'),
                ('shipped','Shipped'),
                ('delivered','Delivered'),
                ('canceled','Canceled')
                ]

# Create your models here.
class Order(models.Model):
    user = models.ForeignKey(CustomUser,on_delete= models.CASCADE)
    address = models.ForeignKey(Address,on_delete=models.SET_NULL,null=True,related_name='orders')
    payment = models.ForeignKey(Payment,on_delete=models.SET_NULL,null=True,related_name='orders')
    total_price = models.DecimalField(max_digits=10,decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=50,choices=ORDER_STATUS ,default='pending')
        
    def __str__(self):
        return f'Order {self.id} by {self.user.username}-{self.status}'
    
class OrderItem(models.Model):
    order = models.ForeignKey(Order,related_name='items',on_delete=models.CASCADE)
    product = models.ForeignKey(Product,on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    
    def __str__(self):
        return f'item of {self.order.id} ordered by {self.order.user.username}'
        
