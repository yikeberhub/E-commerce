# urls.py

from django.urls import path
from .views import CreatePaymentView,chapa_callback

urlpatterns = [
    path('create/', CreatePaymentView.as_view(), name='create-payment'),
     path('callback/', chapa_callback, name='chapa-webhook')
]