# promotions/models.py

from django.db import models
from django.utils import timezone
from products.models import Product  

class Promotion(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField()
    product = models.OneToOneField(Product, related_name='promotion',on_delete=models.CASCADE, blank=True,null=True) 
    active = models.BooleanField(default=True)

    def is_active(self):
        """Check if the promotion is currently active."""
        now = timezone.now()
        return self.start_date <= now <= self.end_date and self.active

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = 'Promotions'