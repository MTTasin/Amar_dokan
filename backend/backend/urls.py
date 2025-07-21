from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter

from orders.views import OrderViewSet
from users.views import WishlistViewSet, UserViewSet, GroupViewSet
from app.views import ProductAdminViewSet, ReviewViewSet # Import ReviewViewSet

# This router handles all authenticated user and admin actions under one prefix
router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'wishlist', WishlistViewSet, basename='wishlist')
router.register(r'users', UserViewSet, basename='user-admin')
router.register(r'roles', GroupViewSet, basename='role')
router.register(r'products', ProductAdminViewSet, basename='product-admin')
router.register(r'reviews', ReviewViewSet, basename='review') # Add dedicated review endpoint

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Djoser authentication URLs
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),

    # Public, read-only API URLs
    path('api/', include('app.urls')),

    # Authenticated user & admin management URLs
    path('api/manage/', include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
