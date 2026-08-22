from django.urls import path
from .views import NotificationListView, NotificationReadView, NotificationDeleteView, mark_all_read

urlpatterns = [
    path('', NotificationListView.as_view(), name='notification-list'),
    path('mark-all-read/', mark_all_read, name='notification-mark-all-read'),
    path('<int:pk>/read/', NotificationReadView.as_view(), name='notification-read'),
    path('<int:pk>/', NotificationDeleteView.as_view(), name='notification-delete'),
]
