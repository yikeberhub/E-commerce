from django.db import models
from users.models import CustomUser,Address
from cart.models import Cart
from products.models import Product


ORDER_STATUS = [
    ('pending', 'Pending'),             # Order created, awaiting payment
    ('payment_processing', 'Payment Processing'),  # Payment is being processed
    ('payment_failed', 'Payment Failed'),          # Payment was not successful
    ('processing', 'Processing'),       # Order is being prepared for shipment
    ('shipped', 'Shipped'),             # Order has been dispatched
    ('delivered', 'Delivered'),         # Order has been delivered to the customer
    ('completed', 'Completed'),         # Order completed (final state)
    ('canceled', 'Canceled'),           # Order has been canceled
    ('returned', 'Returned'),           # Order has been returned
    ('refunded', 'Refunded'),           # Payment has been refunded
]


class Order(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True, related_name='orders')
    payment = models.OneToOneField('payments.Payment', on_delete=models.SET_NULL, null=True, related_name='order_payment')  
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=50, choices=ORDER_STATUS, default='pending')

    def __str__(self):
        return f'Order {self.id} by {self.user.username} - {self.status}'
    
class OrderItem(models.Model):
    order = models.ForeignKey(Order,related_name='items',on_delete=models.CASCADE)
    product = models.ForeignKey(Product,on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    
    
    def __str__(self):
        return f'item of {self.order.id} ordered by {self.order.user.username}'
        
