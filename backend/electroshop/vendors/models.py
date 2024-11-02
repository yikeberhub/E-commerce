from django.db import models
from django.utils.html import mark_safe
from users.models import CustomUser
class Vendor(models.Model):
    title = models.CharField(max_length=100, default='Electro Shop')
    logo = models.ImageField(upload_to='vendors/logo/', default='vendors/default_vendor_image/img.png')
    banner_image = models.ImageField(upload_to='vendors/banner_images/', default='vendors/default_banner_image/default_banner_image.webp')
    description = models.TextField(null=True, blank=True, default='Amazing vendor')
    address = models.CharField(max_length=255, default='123 Main Street')
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, default='+251946472687')
    website = models.URLField(blank=True)

    # Performance Metrics
    chat_response_time = models.PositiveIntegerField(default=100)
    shipping_on_time = models.PositiveIntegerField(default=100)
    authentic_rating = models.DecimalField(max_digits=5, decimal_places=2, default=100.00)
    days_return = models.PositiveIntegerField(default=30)
    warranty_period = models.PositiveIntegerField(default=12)

    
    # Subscription Information
    subscription_plan = models.CharField(max_length=20, choices=[('weekly', 'Weekly'), ('monthly', 'Monthly'), ('yearly', 'Yearly')], default='monthly')
    is_active = models.BooleanField(default=True) 

    user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)

    account_status = models.CharField(max_length=50, choices=[('active', 'Active'), ('suspended', 'Suspended'), ('inactive', 'Inactive')], default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Vendors'
        
    def vendor_image(self):
        if self.logo:  
            return mark_safe('<img src="%s" width="50" height="50" />' % self.logo.url)
        return "No image"  

    def banner_image_display(self):
        if self.banner_image:  
            return mark_safe('<img src="%s" width="100" height="50" />' % self.banner_image.url)
        return "No banner"  

    def __str__(self):
        return self.title


class VendorPayment(models.Model):
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    subscription_fee = models.DecimalField(max_digits=10, decimal_places=2, default=9.99) 
    subscription_start_date = models.DateTimeField(null=True, blank=True)  
    subscription_end_date = models.DateTimeField(null=True, blank=True)     
    payment_method = models.CharField(max_length=50, choices=[('bank_transfer', 'Bank Transfer'), ('paypal', 'PayPal'), ('stripe', 'Stripe')], default='bank_transfer')
    status = models.CharField(max_length=20, choices=[('completed', 'Completed'), ('failed', 'Failed'), ('pending', 'Pending')], default='pending')

    def __str__(self):
        return f"Payment of {self.subscription_fee} by {self.vendor.title} on {self.subscription_start_date}"