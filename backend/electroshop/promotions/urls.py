# promotions/urls.py

from django.urls import path
from .views import PromotionList, PromotionDetail

urlpatterns = [
    path('', PromotionList.as_view(), name='promotion-list'),
    path('<int:pk>/', PromotionDetail.as_view(), name='promotion-detail'),
]