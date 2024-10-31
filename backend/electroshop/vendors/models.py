from django.db import models
from django.utils.html import mark_safe
from users.models import CustomUser

class Vendor(models.Model):
    title = models.CharField(max_length=100, default='Electro Shop')
    image = models.ImageField(upload_to='vendors/vendors_images/', default='vendors/default_vendor_image/img.png')
    banner_image = models.ImageField(upload_to='vendors/banner_images/', default='vendors/default_banner_image/default_banner_image.webp')
    description = models.TextField(null=True, blank=True, default='Amazing vendor')
    address = models.CharField(max_length=255, default='123 Main Street')
    phone_number = models.CharField(max_length=15, default='+251946472687')
    
    # Use IntegerField or DecimalField for numeric values
    chat_res_time = models.PositiveIntegerField(default=100)
    shipping_on_time = models.PositiveIntegerField(default=100)
    authentic_rating = models.DecimalField(max_digits=5, decimal_places=2, default=100.00)
    days_return = models.PositiveIntegerField(default=100)
    warranty_period = models.PositiveIntegerField(default=100)

    user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)

    class Meta:
        verbose_name_plural = 'Vendors'
        
    def vendor_image(self):
        return mark_safe('<img src="%s" width="50" height="50"/>' % self.image.url)
    
    def __str__(self):
        return self.title
