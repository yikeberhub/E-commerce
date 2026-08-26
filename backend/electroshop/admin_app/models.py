from django.db import models


class PlatformSettings(models.Model):
    """Singleton row (always pk=1) holding site-wide configuration an admin
    can edit from the dashboard."""

    site_name = models.CharField(max_length=100, default='ElectroShop')
    support_email = models.EmailField(default='support@electroshop.com')
    support_phone = models.CharField(max_length=20, blank=True)
    commission_rate = models.DecimalField(max_digits=5, decimal_places=2, default=10.00)
    maintenance_mode = models.BooleanField(default=False)
    allow_vendor_registration = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Platform Settings'

    def __str__(self):
        return self.site_name

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


CONTACT_STATUS = [
    ('new', 'New'),
    ('read', 'Read'),
    ('resolved', 'Resolved'),
]


class ContactMessage(models.Model):
    """A submission from the public Contact Us form."""

    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200, blank=True)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=CONTACT_STATUS, default='new')
    admin_reply = models.TextField(blank=True, null=True)
    replied_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name} <{self.email}> - {self.subject or "(no subject)"}'
