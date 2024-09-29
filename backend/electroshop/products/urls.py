from django.urls import path
from .views import product_list,get_product_detail,ProductCreateView

urlpatterns = [
    path('', product_list, name='product-list'),
    path('<int:id>/', get_product_detail, name='product-detail'),
    path('create/', ProductCreateView.as_view(), name='product-create'),
    # path('update/<int:id>/', ProductUpdateView.as_view(), name='product-update'),
    # path('delete/<int:id>/', ProductDeleteView.as_view(), name='product-delete'),
]