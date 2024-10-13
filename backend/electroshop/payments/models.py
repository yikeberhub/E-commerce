from django.db import models
from users.models import CustomUser


PAYMENT_STATUS = [('pending','Pending'),('completed','Completed'),('failed','Failed')]

class Payment(models.Model):
    order = models.OneToOneField('orders.Order',null=True, on_delete=models.CASCADE, related_name='payment_order')  
    payment_status = models.CharField(max_length=20,choices=PAYMENT_STATUS)
    transaction_id = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.transaction_id} - {self.payment_status}"
