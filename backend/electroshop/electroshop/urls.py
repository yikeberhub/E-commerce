
from django.contrib import admin
from django.urls import path,re_path,include
from django.views.generic import TemplateView
from django.views.static import serve
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('admin_api/', include('admin_app.urls')),
    path('users/', include('users.urls')),
    path('vendors/', include('vendors.urls')),
    path('products/', include('products.urls')),
    path('orders/', include('orders.urls')),
    path('payments/', include('payments.urls')),
    path('analytics/', include('analytics.urls')),
    path('promotions/', include('promotions.urls')),
    path('cart/', include('cart.urls')),
    path('wishlist/', include('wishlists.urls')),
    path('notifications/', include('notifications.urls')),
    path('chats/', include('chats.urls')),

]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    # static() no-ops outside DEBUG by design (Django docs say a real web
    # server/CDN should serve media in production). This project has no
    # such thing in front of it on Render, so without this every product,
    # category, vendor, and profile image 404s and the frontend falls
    # back to its placeholder — serve media directly instead.
    urlpatterns += [
        re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
    ]

