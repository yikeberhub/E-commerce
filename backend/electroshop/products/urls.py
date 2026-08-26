# products/urls.py
from django.urls import path
from .views import (
    ProductListView,
    ProductDetailView,
    ProductReviewListView,
    ProductReviewDetailView,
    ProductReviewCreateUpdateView,
    VendorReviewsView,
    ReviewReplyView,
    AdminReviewListView,
    AdminReviewDetailView,
    add_product,
    add_product_image,
    delete_product_image,
FeaturedProductsView,CategoryList,CategoryDetail,TagList,TagDetail
)

urlpatterns = [
    # Product URLs
    path('', ProductListView.as_view(), name='product-list'),
    path('<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('featured/', FeaturedProductsView.as_view(), name='featured-products'),
     path('add/', add_product, name='add_product'),
    path('<int:product_id>/images/', add_product_image, name='add-product-image'),
    path('images/<int:image_id>/', delete_product_image, name='delete-product-image'),

    #tags
    path('tags/', TagList.as_view(), name='tag-list'),  # List and create tags
    path('tags/<int:pk>/', TagDetail.as_view(), name='tag-detail'),  # Retrieve, update, delete tag


    #category review url
    path('categories/', CategoryList.as_view(), name='category-list'),  # List and create categories
    path('categories/<int:pk>/', CategoryDetail.as_view(), name='category-detail'),  # Retrieve, update, delete category

    # Product Review URLs
    path('reviews/admin/', AdminReviewListView.as_view(), name='admin-review-list'),
    path('reviews/admin/<int:pk>/', AdminReviewDetailView.as_view(), name='admin-review-detail'),
    path('reviews/mine/', VendorReviewsView.as_view(), name='vendor-reviews'),
    path('reviews/<int:pk>/reply/', ReviewReplyView.as_view(), name='review-reply'),
    path('<int:product_id>/reviews/', ProductReviewListView.as_view(), name='product-review-list'),  # List/Create
    path("<int:product_id>/reviews/<int:pk>/", ProductReviewDetailView.as_view(), name="product-review-detail"),
    path("<int:product_id>/reviews/add/", ProductReviewCreateUpdateView.as_view(), name="add-product-review"),

]