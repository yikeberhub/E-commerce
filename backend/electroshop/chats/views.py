from django.db.models import Q
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Message
from .serializers import MessageSerializer
from users.serializers import PublicUserSerializer
from notifications.utils import notify

User = get_user_model()


class ConversationListView(APIView):
    """Lists the authenticated user's conversations, one row per distinct
    other participant, most-recently-active first."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        messages = (
            Message.objects.filter(Q(sender=user) | Q(recipient=user))
            .select_related('sender', 'recipient')
            .order_by('-created_at')
        )

        conversations = {}
        for msg in messages:
            partner = msg.recipient if msg.sender_id == user.id else msg.sender
            if partner.id not in conversations:
                conversations[partner.id] = {
                    'partner': PublicUserSerializer(partner, context={'request': request}).data,
                    'last_message': msg.body,
                    'last_message_at': msg.created_at,
                    'unread_count': Message.objects.filter(
                        sender=partner, recipient=user, is_read=False
                    ).count(),
                }

        return Response(list(conversations.values()))


class MessageThreadView(generics.ListCreateAPIView):
    """GET returns (and marks read) the message thread with `partner_id`;
    POST sends a new message to that user."""
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_partner(self):
        return get_object_or_404(User, id=self.kwargs['partner_id'])

    def get_queryset(self):
        user = self.request.user
        partner = self.get_partner()
        return Message.objects.filter(
            Q(sender=user, recipient=partner) | Q(sender=partner, recipient=user)
        ).select_related('sender', 'recipient')

    def list(self, request, *args, **kwargs):
        partner = self.get_partner()
        Message.objects.filter(
            sender=partner, recipient=request.user, is_read=False
        ).update(is_read=True)
        return super().list(request, *args, **kwargs)

    def perform_create(self, serializer):
        partner = self.get_partner()
        message = serializer.save(sender=self.request.user, recipient=partner)
        try:
            notify(
                recipient=partner,
                notification_type='message',
                title=f'New message from {self.request.user.username}',
                message=message.body[:140],
            )
        except Exception:
            pass
