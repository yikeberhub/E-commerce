from django.db import models
from users.models import CustomUser

PAYMENT_STATUS = [
    ('pending', 'Pending'),          # Payment is initiated but not yet completed
    ('completed', 'Completed'),      # Payment has been successfully completed
    ('failed', 'Failed'),            # Payment process has failed
    ('refunded', 'Refunded'),        # Payment has been refunded to the customer
]

PAYMENT_METHODS  = [
    ('chapa','Chapa'),
    ('paypal','Paypal'),
    ('cash','Cash on Delivery')
]

CHAPA_SUB_METHODS = [
        ('telebirr', 'Telebirr'),
        ('cbe', 'CBE'),
    ]

class Payment(models.Model):
    order = models.OneToOneField('orders.Order', null=True, on_delete=models.CASCADE, related_name='payment')  
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='pending') 
    transaction_id = models.CharField(max_length=255, unique=True) 
    amount = models.DecimalField(max_digits=10, decimal_places=2,default=0.00)  
    currency = models.CharField(max_length=15,choices=[('birr','Birr'),('usd','USD')],default='birr')
    payment_method = models.CharField(max_length=100,choices=PAYMENT_METHODS, default='chapa')  
    chapa_sub_method = models.CharField(max_length=50, choices=CHAPA_SUB_METHODS, null=True, blank=True) 
    charge = models.DecimalField(max_digits=10, decimal_places=2,default=0)  
    payment_gateway = models.CharField(max_length=100, default='CBE')  
    created_at = models.DateTimeField(auto_now_add=True)  
    updated_at = models.DateTimeField(auto_now=True)    

    def __str__(self):
        return f"Payment {self.transaction_id or 'N/A'} for Order  {self.chapa_sub_method or ''}"


class PaymentSession(models.Model):
    """One record per Chapa charge. Checkout splits the cart into one
    Order+Payment per vendor, but Chapa is charged once for the total —
    this is the server-side link from that one tx_ref back to every
    local Payment row it should mark paid, so the webhook (which has no
    access to the browser's localStorage) can resolve it."""
    tx_ref = models.CharField(max_length=255, unique=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='payment_sessions')
    payments = models.ManyToManyField(Payment, related_name='payment_sessions')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'PaymentSession {self.tx_ref}'


class Transaction(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='transactions')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_date = models.DateTimeField(auto_now_add=True)
    order_id = models.CharField(max_length=255, blank=True, null=True)  
    transaction_type = models.CharField(max_length=50)  

    def __str__(self):
        return f'Transaction {self.id} - {self.amount} for {self.user.username}'