# urls.py

from django.urls import path
from .views import CreatePaymentView,chapa_callback,check_payment_status,VendorPaymentsView,PaymentDetailView

urlpatterns = [
    path('create/', CreatePaymentView.as_view(), name='create-payment'),
     path('callback/<int:order_id>/', chapa_callback, name='chapa-webhook'),
     path('check_payment_status/<str:payment_reference>/', check_payment_status, name='check_payment_status'),
     path('mine/', VendorPaymentsView.as_view(), name='vendor-payments'),
     path('<int:pk>/', PaymentDetailView.as_view(), name='payment-detail'),

]