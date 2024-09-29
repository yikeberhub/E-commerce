from django.db import models
from django.utils.html import mark_safe

from users.models import CustomUser


# Create your models here.


class Vendor(models.Model):
    title = models.CharField(max_length=100, default='Electro shop')
    image = models.ImageField(upload_to='vendors/vendors_images/', default='vendors/default_vendor_image/img.png')
    description = models.TextField(null=True, blank=True, default='Amazing vendor')
    address = models.CharField(max_length=100, default='123 Main street')
    phone_number = models.CharField(max_length=15, default='+251946472687')
    chat_res_time = models.CharField(max_length=100, default='100')
    shipping_on_time = models.CharField(max_length=100, default='100')
    authentic_rating = models.CharField(max_length=100, default='100')
    days_return = models.CharField(max_length=100, default='100')
    warranty_period = models.CharField(max_length=100, default='100')
    user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)

    class Meta:
        verbose_name_plural = 'Vendors'
        
    def vendor_image(self):
        return mark_safe('<img src="%s" width="50" height="50"/>' % self.image.url)
    
    def __str__(self):
        return self.title
