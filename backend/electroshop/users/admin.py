from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import CustomUser
# Register your models here.

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    ordering = ('email',)

    model =CustomUser
    list_display=['email','username','role','phone_number','profile_image','is_active','is_staff']
    list_filter = ('role','is_active','is_staff')
    search_fields = ('email','username',)
    ordering = ('email',)
    
    fieldsets = UserAdmin.fieldsets +(
        (None,{
            'fields':(
                'profile_image','phone_number','address','date_of_birth','role','account_status',
                'is_email_verified','is_phone_verified','billing_address','payment_method',
            )
        }),
    )
    
    add_fieldsets = UserAdmin.fieldsets +(
        (None,{
            'fields':(
                'profile_image','phone_number','address','date_of_birth','role','account_status',
                'is_email_verified','is_phone_verified','billing_address','payment_method',
            )
        }),
    )
    
admin.site.register(CustomUser,CustomUserAdmin)
