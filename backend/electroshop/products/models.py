from django.db import models
from django.utils.html import mark_safe

from users.models import CustomUser
from vendors .models import Vendor


# Create your models here.
STATUS = (
    ('draft', 'Draft'),
    ('disabled', 'Disabled'),
    ('in_review', 'In Review'),
    ('published', 'Published'),
    ('rejected', 'Rejected'),
)

class Category(models.Model):
    title = models.CharField(max_length=100, default='Electronics')
    image = models.ImageField(upload_to='category/category_images/', default='category/default_category_image/img.png')

    class Meta:
        verbose_name_plural = 'Categories'
        
    def category_image(self):
        return mark_safe('<img src="%s" width="50" height="50"/>' % self.image.url)
    
    def __str__(self):
        return self.title


class Product(models.Model):
    title = models.CharField(max_length=100, default='New brand')
    image = models.ImageField(max_length=300,upload_to='products/product_image/', default='products/default_product_image/img.png')
    description = models.TextField(null=True, blank=True, default='This is the product')
    user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)
    vendor = models.ForeignKey(Vendor, on_delete=models.SET_NULL, null=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    price = models.DecimalField(max_digits=10, decimal_places=2, default=1.99)
    old_price = models.DecimalField(max_digits=10, decimal_places=2, default=2.99)
    specifications = models.TextField(null=True, blank=True)
    product_status = models.CharField(choices=STATUS, max_length=10, default='in_review')
    status = models.BooleanField(default=True)
    in_stock = models.BooleanField(default=True)
    featured = models.BooleanField(default=False)
    digital = models.BooleanField(default=True)
    date = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(null=True, auto_now=True, blank=True)

    class Meta:
        verbose_name_plural = 'Products'
        
    def product_image(self):
        return mark_safe('<img src="%s" width="50" height="50"/>' % self.image.url)
    
    def __str__(self):
        return self.title
    
    def get_percentage(self):
        return (self.price / self.old_price) * 100


class ProductImages(models.Model):
    product = models.ForeignKey(Product,related_name='images', on_delete=models.SET_NULL, null=True)
    image = models.ImageField(max_length=300,upload_to='products/product_images/', null=True,blank=True)
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Product Images'