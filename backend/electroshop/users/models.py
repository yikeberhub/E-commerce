from django.db import models
from django.contrib.auth.models import AbstractUser

ROLE_CHOICES = [
    ('admin','Admin'),
    ('vendor','Vendor'),
    ('customer','Customer'),
]
ACCOUNT_STATUS_CHOICES = [
        ('active','Active'),
        ( 'suspended','Suspended'),
        ('deactivated','Deactivated'),
         
    ]

class CustomUser(AbstractUser):
    email = models.EmailField(max_length=100, unique=True)
    first_name = models.CharField(max_length=50,blank=True)
    last_name = models.CharField(max_length=50,blank=True)
    profile_image = models.ImageField(upload_to='users/user_profile_images/',default='users/default_profile_image/img.png',blank=True,null=True)
    phone_number = models.CharField(max_length=15,blank=True,null=True)
    bio = models.TextField(blank=True,null=True)
    date_of_birth = models.DateField(blank=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    role = models.CharField(max_length=15,choices=ROLE_CHOICES,default='customer')
    last_login = models.DateTimeField(blank=True,null=True)
    account_status = models.CharField(max_length=15,default='active',choices=ACCOUNT_STATUS_CHOICES)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username','password']

    def __str__(self) -> str:
        return self.email
    
class Address(models.Model):
    user = models.ForeignKey(CustomUser,on_delete=models.CASCADE,related_name='addresses')
    full_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    kebele = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    region = models.CharField(max_length=100)
    woreda = models.CharField(max_length=100)
    street_address = models.CharField(max_length=255)
    postal_code = models.CharField(max_length=20,blank=True,null=True)
    delivery_instruction = models.TextField(blank=True,null=True)
    is_default = models.BooleanField(default=False)
    
    
    def __str__(self) -> str:
        return f"{self.full_name},{self.city},{self.region}"
    