from django.db import models
from users.models import CustomUser
from products.models import Product


class Message(models.Model):
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='received_messages')
    product = models.ForeignKey(Product, null=True, blank=True, on_delete=models.SET_NULL, related_name='messages')
    body = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f'{self.sender_id} -> {self.recipient_id}: {self.body[:30]}'
