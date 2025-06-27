# signals.py

from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Product, Category

@receiver(post_save, sender=Product)
def update_product_count_on_create(sender, instance, created, **kwargs):
    """Update the product count when a product is created."""
    if created and instance.category:
        instance.category.calculate_num_of_products()

@receiver(post_delete, sender=Product)
def update_product_count_on_delete(sender, instance, **kwargs):
    """Update the product count when a product is deleted."""
    if instance.category:
        instance.category.calculate_num_of_products()