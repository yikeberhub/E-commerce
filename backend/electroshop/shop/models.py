from django.db import models
from django.utils.html import mark_safe
from django.contrib.auth.models import User


STATUS_CHOICE= (
    ('process','Processing'),
    ('shiped','Shiped'),
    ('delivered','Delivered'),
)



STATUS= (
    ('draft ','Draft'),
    ('disabled','Disabled'),
    ('in_review','In Review'),
    ('published','Published'),
    ('rejected','Rejected'),
)

RATING= (
    (1,'⭐✨✨✨✨'),
    (2,'⭐⭐✨✨✨'),
    (3,'⭐⭐⭐✨✨'),
    (4,'⭐⭐⭐⭐✨'),
    (5,'⭐⭐⭐⭐⭐'),
)

def user_directory_path(instance,filename):
    return'user_{0}/{1}'.format(instance.user.id,filename)

# Customize user model.
# class User(AbstractBaseUser):
#     username = models.CharField(max_length=100)
#     email = models.EmailField(max_length=500,unique=True)
#     password = models.CharField(max_length=50)
#    # avatar = models.ImageField(null=True,default='images/avatar.svg',upload_to='images/profile_images')
#     REQUIRED_FIELDS = ['username','email','password']
#     USERNAME_FIELD = 'email'
    
#     def __str__(self):
#         self.username



class Category(models.Model):
    title = models.CharField(max_length=100,default='Electronics')
    image = models.ImageField(upload_to='category',default='category/category.jpg')
    
    class Meta:
        verbose_name_plural = 'Categories'
        
    def category_image(self):
        return mark_safe('<img src="%s" width ="50" height ="50"/>'%(self.image.url))
    
    def __str__(self) -> str:
        return self.title
    
class Vendor(models.Model):
        title = models.CharField(max_length=100,default='Electro shop')
        image = models.ImageField(upload_to=user_directory_path,default='vendor.jpg')
        description  = models.TextField(null=True,blank=True,default='Amazing vendor ')
        
        address = models.CharField(max_length=100,default='123 Main street')
        address = models.CharField(max_length=100,default='+251946472687')
        chat_res_time = models.CharField(max_length=100,default='100')
        shipping_on_time = models.CharField(max_length=100,default='100')
        authentic_rating = models.CharField(max_length=100,default='100')
        days_return = models.CharField(max_length=100,default='100')
        warranty_period = models.CharField(max_length=100,default='100')
        
        user = models.ForeignKey(User,on_delete=models.SET_NULL,null=True)
        
        class Meta:
          verbose_name_plural = 'Vendors'
        
        def vendor_image(self):
             return mark_safe('<img src="%s" width ="50" height ="50"/>'%(self.image.url))
    
        def __str__(self) -> str:
            return self.title
        
        
class Tags(models.Model):
    pass
  
class Product(models.Model):
    title = models.CharField(max_length=100,default='New brand')
    image = models.ImageField(upload_to=user_directory_path,default='product.jpg')
    description  = models.TextField(null=True,blank=True,default='This is the product ')

    user = models.ForeignKey(User,on_delete=models.SET_NULL,null=True)
    vendor = models.ForeignKey(Vendor,on_delete=models.SET_NULL,null=True)
    category = models.ForeignKey(Category,on_delete=models.SET_NULL,null=True,related_name='category')
    
    price = models.DecimalField(max_digits=9999999999,decimal_places=2,default='1.99')
    old_price = models.DecimalField(max_digits=9999999999,decimal_places=2,default='2.99')
    
    specifications = models.TextField(null=True,blank=True)
    #tags = models.ForeignKey(Tags,on_delete=models.SET_NULL,null=True)
    
    product_status = models.CharField(choices=STATUS,max_length=10,default='in review')
    
    status = models.BooleanField(default=True)
    in_stock = models.BooleanField(default=True)
    featured = models.BooleanField(default=False)
    digital = models.BooleanField(default=True )
    
    date = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(null=True,auto_now=True,blank=True)
    
    class Meta:
       verbose_name_plural = 'Products'
        
    def product_image(self):
             return mark_safe('<img src="%s" width ="50" height ="50"/>'%(self.image.url))
    
    def __str__(self):
            return self.title
    def get_percentatge(self):
        new_price = (self.price/self.old_price)*100
        return new_price
    
    
class ProductImages(models.Model):
    images = models.ImageField(upload_to='products_images',default='product.jpg')
    product = models.ForeignKey(Product,on_delete=models.SET_NULL,null=True )
    date =  models.DateTimeField(auto_now_add=True)
    
    class Meta:
       verbose_name_plural = 'Product Images'
         
        
        
########################################## Cart, Order,OrderItems  ################3
########################################## Cart, Order,OrderItems  ################3
########################################## Cart, Order,OrderItems  ################3
########################################## Cart, Order,OrderItems  ################3


class CartOrder(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=9999999999,decimal_places=2,default='1.99')
    paid_status = models.BooleanField(default=False)
    
    order_date =  models.DateTimeField(auto_now_add=True)

    product_status = models.CharField(choices=STATUS_CHOICE,max_length=10,default='processing')
    
    class Meta:
       verbose_name_plural = 'Cart Order'
       
class CartOrderItems(models.Model):
        order = models.ForeignKey(CartOrder,on_delete=models.CASCADE)
        product_status = models.CharField(choices=STATUS_CHOICE,max_length=10,default='processing')
        invoice_no = models.CharField(max_length=200)
        item = models.CharField(max_length=200)
        image = models.ImageField(upload_to=user_directory_path,default='product.jpg')
        quantity = models.IntegerField ()
        price = models.DecimalField(max_digits=9999999999,decimal_places=2,default='1.99')
        totol_price = models.DecimalField(max_digits=9999999999,decimal_places=2,default='1.99')

        class Meta:
          verbose_name_plural = 'Cart Order Items'
          
        def __str__(self):
            self.item    
            
        def order_image(self):
             return mark_safe('<img src="/medias/%s " width ="50" height ="50"/>'%(self.image))
    

  
##########################################Product Review Wishlist Address ################
##########################################Product Review Wishlist Address ################
##########################################Product Review Wishlist Address ################
##########################################Product Review Wishlist Address ################


class ProductReviews(models.Model):
    user = models.ForeignKey(User,on_delete=models.SET_NULL,null=True)
    product   = models.ForeignKey(Product,on_delete=models.SET_NULL,null=True)
    review = models.TextField()
    rating = models.IntegerField(choices=RATING,default=None)
    date = models.DateTimeField(auto_now_add=True)
    class Meta:
          verbose_name_plural = 'Product Reviews'
          
    def __str__(self):
            self.product.title    
            
    def get_rating(self):
        return self.rating
    
    
class Wishlist(models.Model):
    user = models.ForeignKey(User,on_delete=models.SET_NULL,null=True)
    product   = models.ForeignKey(Product,on_delete=models.SET_NULL,null=True)
    date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
          verbose_name_plural = 'Wishlists'
          
    def __str__(self):
            self.product.title    
        
class Address(models.Model):
        user = models.ForeignKey(User,on_delete=models.SET_NULL,null=True)
        address = models.CharField(max_length=100,null=True)
        status= models.BooleanField(default=False)
        
        class Meta:
          verbose_name_plural = 'Address'
         

    
    
    

       
    
    
    
    