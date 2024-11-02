from django.contrib import admin
from .models import Vendor,VendorPayment

class VendorAdmin(admin.ModelAdmin):
    list_display = ('title', 'vendor_image', 'banner_image_display', 'email', 'phone_number', 'is_active')
    
class VendorPaymentAdmin(admin.ModelAdmin):
    list_display = ('vendor', 'subscription_fee', 'subscription_start_date', 'payment_method', 'status')

admin.site.register(VendorPayment, VendorPaymentAdmin)
admin.site.register(Vendor, VendorAdmin)
