from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Vendor


    
class VendorAdmin(admin.ModelAdmin):
    list_display = ['title','vendor_image']
 
admin.site.register(Vendor,VendorAdmin)
