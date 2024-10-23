# products/urls.py
from django.urls import path
from .views import (
    ProductListView,
    ProductDetailView,
    ProductReviewListView,
    ProductReviewDetailView,
    FeaturedProductsView,CategoryList,CategoryDetail,TagList
)

urlpatterns = [
    # Product URLs
    path('', ProductListView.as_view(), name='product-list'),  # List/Create
    path('<int:pk>/', ProductDetailView.as_view(), name='product-detail'),  # Retrieve/Update/Delete
    path('featured/', FeaturedProductsView.as_view(), name='featured-products'),
    
    #tags
    path('tags/', TagList.as_view(), name='tag-list'),  # List and create tags

    
    #category review url
    path('categories/', CategoryList.as_view(), name='category-list'),  # List and create categories
    path('categories/<int:pk>/', CategoryDetail.as_view(), name='category-detail'),  # Retrieve, update, delete category
    
    # Product Review URLs
    path('reviews/', ProductReviewListView.as_view(), name='product-review-list'),  # List/Create
    path('reviews/<int:pk>/', ProductReviewDetailView.as_view(), name='product-review-detail'),  # Retrieve/Update/Delete
]