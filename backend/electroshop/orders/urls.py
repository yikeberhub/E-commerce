from django.urls import path

from .views import OrderListView,UserOrderStatusListView, UserSalesChartView,OrderDetailView,OrderUpdateView,OrderCancelView,CheckoutView
urlpatterns = [
    path('',OrderListView.as_view(),name='orders'),
     path('sales-chart/', UserSalesChartView.as_view(), name='sales-chart'),
    path('status-chart/',UserOrderStatusListView.as_view(),name='order-chart'),
    path('checkout/',CheckoutView.as_view(),name='checkout'),
    path('<int:order_id>/', OrderDetailView.as_view(), name='order-detail'),
    path('<int:order_id>/update/', OrderUpdateView.as_view(), name='order-update'),
    path('cancel/<int:order_id>/', OrderCancelView.as_view(), name='order-cancel'),
]