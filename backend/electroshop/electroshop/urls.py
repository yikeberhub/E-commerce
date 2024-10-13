
from django.contrib import admin
from django.urls import path,re_path,include
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    # path('shop/', include('shop.urls')),
    path('users/', include('users.urls')),
    # path('vendors/', include('vendors.urls')),
    path('products/', include('products.urls')),
    path('orders/', include('orders.urls')),
    path('payments/', include('payments.urls')),
    path('reviews/', include('reviews.urls')),
    # path('promotions/', include('promotions.urls')),
    # path('analytics/', include('analytics.urls')),
    # path('notifications/', include('notifications.urls')),
    path('cart/', include('cart.urls')),
    path('wishlist/', include('wishlists.urls')),
    # re_path(r'^.*$',TemplateView.as_view(template_name = '../../../frontend/public/index.html'))

]
if settings.DEBUG:  
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

