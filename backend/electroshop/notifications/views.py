from django.shortcuts import render
from rest_framework import generics
# Create your views here.

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer

    def get_queryset(self):
        user = self.request.user
        return Notification.objects.filter(user=user)

class NotificationReadView(generics.UpdateAPIView):
    serializer_class = NotificationSerializer
    queryset = Notification.objects.all()

class NotificationDeleteView(generics.DestroyAPIView):
    serializer_class = NotificationSerializer
    queryset = Notification.objects.all()