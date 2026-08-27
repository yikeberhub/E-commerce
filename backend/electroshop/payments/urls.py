# urls.py

from django.urls import path
from .views import (
    CreatePaymentView,chapa_callback,check_payment_status,VendorPaymentsView,PaymentDetailView,
    WithdrawalRequestListCreateView,WithdrawalRequestDetailView,
)

urlpatterns = [
    path('create/', CreatePaymentView.as_view(), name='create-payment'),
     path('callback/<str:tx_ref>/', chapa_callback, name='chapa-webhook'),
     path('check_payment_status/<str:payment_reference>/', check_payment_status, name='check_payment_status'),
     path('mine/', VendorPaymentsView.as_view(), name='vendor-payments'),
     path('withdrawals/', WithdrawalRequestListCreateView.as_view(), name='withdrawal-list'),
     path('withdrawals/<int:pk>/', WithdrawalRequestDetailView.as_view(), name='withdrawal-detail'),
     path('<int:pk>/', PaymentDetailView.as_view(), name='payment-detail'),

]