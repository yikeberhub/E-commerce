from rest_framework import serializers
from .models import Message
from users.serializers import PublicUserSerializer


class MessageSerializer(serializers.ModelSerializer):
    sender = PublicUserSerializer(read_only=True)
    recipient = PublicUserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'sender', 'recipient', 'product', 'body', 'is_read', 'created_at']
        read_only_fields = ['id', 'sender', 'recipient', 'is_read', 'created_at']
