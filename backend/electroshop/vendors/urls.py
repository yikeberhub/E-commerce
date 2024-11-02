# vendors/urls.py
from django.urls import path
from .views import VendorListView, VendorDetailView,VendorRegistrationView

urlpatterns = [
    path('', VendorListView.as_view(), name='vendor-list'),  
    path('<int:pk>/', VendorDetailView.as_view(), name='vendor-detail'),  
    path('register/',VendorRegistrationView.as_view(),name='vendor-register')
]