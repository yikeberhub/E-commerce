# promotions/admin.py

from django.contrib import admin
from .models import Promotion

@admin.register(Promotion)
class PromotionAdmin(admin.ModelAdmin):
    list_display = ('title', 'discount_percentage', 'start_date', 'end_date', 'active')
    fields = ('title', 'description', 'discount_percentage', 'start_date', 'end_date', 'product', 'active')
    list_filter = ('active',)
    search_fields = ('title',)
    
    
    