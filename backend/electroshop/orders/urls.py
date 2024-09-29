from django.urls import path

from .views import OrderCreateView,OrderDetailView,OrderUpdateView,OrderCancelView
urlpatterns = [
    path('api/orders/', OrderCreateView.as_view(), name='order-create'),
    path('api/orders/<int:id>/', OrderDetailView.as_view(), name='order-detail'),
    path('api/orders/update/<int:id>/', OrderUpdateView.as_view(), name='order-update'),
    path('api/orders/cancel/<int:id>/', OrderCancelView.as_view(), name='order-cancel'),
]