from django.db import models
from users.models import CustomUser

PAYMENT_STATUS = [('pending','Pending'),('completed','Completed'),('failed','Failed')]

PAYMENT_GATEWAY = [('chapa','Chapa'),('paypal','Paypal')]
# Create your models here.
class Payment(models.Model):
    user = models.ForeignKey(CustomUser,on_delete=models.CASCADE,related_name='payments')
    order_id = models.CharField(max_length=255)
    payment_method = models.CharField(max_length=50)
    payment_gateway = models.CharField(max_length=50,choices=PAYMENT_GATEWAY, default='chapa')
    payment_status = models.CharField(max_length=20,choices=PAYMENT_STATUS)
    amount = models.DecimalField(max_digits=10,decimal_places=2)
    transaction_id = models.CharField(max_length=255,unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self) -> str:
        return f" payment{self.transaction_id}-{self.payment_status}"
    
