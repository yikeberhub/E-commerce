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
    address = models.TextField(blank=True,null=True)
    profile_image = models.ImageField(upload_to='users/user_profile_images/',default='users/default_profile_image/img.png',blank=True,null=True)
    phone_number = models.CharField(max_length=15,blank=True,null=True)
    date_of_birth = models.DateField(blank=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    role = models.CharField(max_length=15,choices=ROLE_CHOICES,default='customer')
    last_login = models.DateTimeField(blank=True,null=True)
    account_status = models.CharField(max_length=15,default='active',choices=ACCOUNT_STATUS_CHOICES)
    is_email_verified =  models.BooleanField(default=False)
    is_phone_verified = models.BooleanField(default=False)
    billing_address =  models.TextField(blank=True,null=True)
    payment_method = models.CharField(max_length=100,blank=True,null=True)
    
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username','password']

    def __str__(self) -> str:
        return self.email