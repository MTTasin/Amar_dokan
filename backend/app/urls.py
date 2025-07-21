from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SiteConfigurationView,
    CategoryViewSet,
    ProductViewSet,
    ColorViewSet,
    SizeViewSet,
    HeroSlideViewSet,
    ProductDetailView # Import the new detail view
)

# This router handles the public-facing LIST endpoints
router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'products', ProductViewSet, basename='product') # This now only handles the list view
router.register(r'colors', ColorViewSet, basename='color')
router.register(r'sizes', SizeViewSet, basename='size')
router.register(r'hero-slides', HeroSlideViewSet, basename='hero-slide')

# The API URLs are now a combination of the router and a specific path for the detail view
urlpatterns = [
    path('site-config/', SiteConfigurationView.as_view(), name='site-config'),
    
    # New path for the product detail view
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    
    # Include all the list view URLs from the router
    path('', include(router.urls)),
]
