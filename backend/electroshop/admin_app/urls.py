from django.urls import path
from .views import SuperAdminDashboardView, VendorAdminDashboardView, UserViewSet

# Define user list and detail views
user_list = UserViewSet.as_view({'get': 'list', 'post': 'create'})
user_detail = UserViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})

urlpatterns = [
    # Super admin dashboard view
    path('super-admin-dashboard/', SuperAdminDashboardView.as_view(), name='super_admin_dashboard'),
    
    # User management endpoints
    path('super-admin-dashboard/users/', user_list, name='user-list'),
    path('super-admin-dashboard/users/<int:pk>/', user_detail, name='user-detail'),

    # Vendor admin dashboard view
    path('vendor-admin-dashboard/', VendorAdminDashboardView.as_view(), name='vendor_admin_dashboard'),
]