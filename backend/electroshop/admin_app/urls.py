from django.urls import path
from .views import (
    SuperAdminDashboardView, VendorAdminDashboardView, UserViewSet, UserDetailView,
    PlatformSettingsView, ContactMessageCreateView, ContactMessageListView, ContactMessageDetailView,
)

# Define user list and detail views
user_list = UserViewSet.as_view({'get': 'list', 'post': 'create'})
user_detail = UserViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})

urlpatterns = [
    # Super admin dashboard view
    path('super-admin-dashboard/', SuperAdminDashboardView.as_view(), name='super_admin_dashboard'),

    # User management endpoints
    path('super-admin-dashboard/users/', user_list, name='user-list'),
    path('super-admin-dashboard/users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),

    # Platform settings
    path('settings/', PlatformSettingsView.as_view(), name='platform-settings'),

    # Contact Us — public submit, admin-only inbox
    path('contact/', ContactMessageCreateView.as_view(), name='contact-create'),
    path('super-admin-dashboard/contact/', ContactMessageListView.as_view(), name='contact-list'),
    path('super-admin-dashboard/contact/<int:pk>/', ContactMessageDetailView.as_view(), name='contact-detail'),

    # Vendor admin dashboard view
    path('vendor-admin-dashboard/', VendorAdminDashboardView.as_view(), name='vendor_admin_dashboard'),
]