# admin_app/serializers.py

from rest_framework import serializers
from .models import PlatformSettings, ContactMessage


class PlatformSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlatformSettings
        fields = [
            'site_name', 'support_email', 'support_phone', 'commission_rate',
            'maintenance_mode', 'allow_vendor_registration', 'updated_at',
        ]
        read_only_fields = ['updated_at']


class ContactMessageCreateSerializer(serializers.ModelSerializer):
    """Used by the public Contact Us form — no status/reply fields."""

    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'subject', 'message']


class ContactMessageSerializer(serializers.ModelSerializer):
    """Used by the admin inbox — exposes status/reply for moderation."""

    class Meta:
        model = ContactMessage
        fields = [
            'id', 'name', 'email', 'subject', 'message',
            'status', 'admin_reply', 'replied_at', 'created_at',
        ]
        read_only_fields = ['name', 'email', 'subject', 'message', 'created_at', 'replied_at']
