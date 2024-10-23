# products/urls.py
from django.urls import path
from .views import (
    ProductListView,
    ProductDetailView,
    ProductReviewListView,
    ProductReviewDetailView,
    FeaturedProductsView
)

urlpatterns = [
    # Product URLs
    path('', ProductListView.as_view(), name='product-list'),  # List/Create
    path('<int:pk>/', ProductDetailView.as_view(), name='product-detail'),  # Retrieve/Update/Delete
    path('featured/', FeaturedProductsView.as_view(), name='featured-products'),


    # Product Review URLs
    path('reviews/', ProductReviewListView.as_view(), name='product-review-list'),  # List/Create
    path('reviews/<int:pk>/', ProductReviewDetailView.as_view(), name='product-review-detail'),  # Retrieve/Update/Delete
]