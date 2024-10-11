from django.db import models
from users.models import CustomUser


PAYMENT_STATUS = [('pending','Pending'),('completed','Completed'),('failed','Failed')]

PAYMENT_GATEWAY = [('chapa','Chapa'),('paypal','Paypal')]
# Create your models here.
class Payment(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='payments')
    order = models.OneToOneField('orders.Order',null=True, on_delete=models.CASCADE, related_name='payment_order')  # Unique related_name
    payment_status = models.CharField(max_length=20,choices=PAYMENT_GATEWAY)
    amount = models.DecimalField(max_digits=10, decimal_places=2,blank=True,null=True)
    transaction_id = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.transaction_id} - {self.payment_status}"
