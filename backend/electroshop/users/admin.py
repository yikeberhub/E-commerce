from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import CustomUser,Address
# Register your models here.

class AddressAdmin(admin.TabularInline):
    model = Address

class CustomUserAdmin(UserAdmin):
    inlines = [AddressAdmin]
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
                'profile_image','phone_number','date_of_birth','role','account_status',
                
            )
        }),
    )
    
    add_fieldsets = UserAdmin.fieldsets +(
        (None,{
            'fields':(
                'profile_image','phone_number','date_of_birth','role','account_status',
            )
        }),
    )
    
admin.site.register(CustomUser,CustomUserAdmin)
admin.site.register(Address)
