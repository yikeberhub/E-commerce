from django.urls import path
from .views import ConversationListView, MessageThreadView

urlpatterns = [
    path('', ConversationListView.as_view(), name='conversation-list'),
    path('<int:partner_id>/', MessageThreadView.as_view(), name='message-thread'),
]
