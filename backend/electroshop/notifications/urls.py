from django.urls import path


urlpatterns = [
    path('',notifications,name='notification'),
    path('notifications/<str:id>/read/',notification_read,name='mark-notification-read'),
    path('notifications/<str:id/delete/',delete_notification,name='delete-notification'),
]