# users/views.py




from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

from app.models import Product
from app.serializers import ProductListSerializer
from backend.app import signals
from .serializers import UserAdminSerializer, GroupSerializer # Import new serializers

User = get_user_model()

class WishlistViewSet(viewsets.ViewSet):
    """
    A ViewSet for managing a user's wishlist (saved products).
    """
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        user = request.user
        queryset = user.saved_products.all()
        serializer = ProductListSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def add(self, request, pk=None):
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({'detail': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        user = request.user
        user.saved_products.add(product)
        return Response({'detail': 'Product added to wishlist.'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def remove(self, request, pk=None):
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({'detail': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)
            
        user = request.user
        user.saved_products.remove(product)
        return Response({'detail': 'Product removed from wishlist.'}, status=status.HTTP_200_OK)


# NEW: ViewSet for admins to manage users
class UserViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for viewing and editing user instances.
    Accessible only by admin users.
    """
    queryset = User.objects.all().order_by('name')
    serializer_class = UserAdminSerializer
    permission_classes = [permissions.IsAdminUser]
    # FIX: Disable pagination to ensure a simple array is always returned.
    pagination_class = None

# NEW: ViewSet for admins to list available roles (Groups)
class GroupViewSet(viewsets.ReadOnlyModelViewSet):
    """
    A ViewSet for listing available user roles (Groups).
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAdminUser]
    pagination_class = None














# users/serializers.py





from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from djoser.serializers import UserSerializer as BaseUserSerializer
from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

# NEW: Serializer for the Group model (which we'll use for roles)
class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']

class UserCreateSerializer(BaseUserCreateSerializer):
    """
    Serializer for creating users. Inherits from Djoser's default.
    """
    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'name', 'password')

class UserSerializer(BaseUserSerializer):
    """
    Serializer for regular user data retrieval.
    """
    class Meta(BaseUserSerializer.Meta):
        model = User
        fields = ('id', 'email', 'name', 'is_staff')

# NEW: Serializer for admins to manage users
class UserAdminSerializer(serializers.ModelSerializer):
    """
    Serializer for admins to view and manage user details, including their roles.
    """
    groups = GroupSerializer(many=True, read_only=True) # For reading roles
    
    # For writing roles, we'll accept a list of group IDs
    group_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Group.objects.all(), source='groups', write_only=True, required=False
    )

    class Meta:
        model = User
        fields = ('id', 'email', 'name', 'is_staff', 'is_active', 'groups', 'group_ids')
        read_only_fields = ('email',) # Prevent email from being changed














# users/models.py





from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils.translation import gettext_lazy as _

class UserAccountManager(BaseUserManager):
    """
    Custom user model manager where email is the unique identifier
    for authentication instead of usernames.
    """
    def create_user(self, email, password=None, **extra_fields):
        """
        Create and save a User with the given email and password.
        """
        if not email:
            raise ValueError(_('The Email must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        """
        Create and save a SuperUser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        
        return self.create_user(email, password, **extra_fields)

class UserAccount(AbstractBaseUser, PermissionsMixin):
    """
    Custom User Account model.
    """
    email = models.EmailField(_("Email Address"), max_length=255, unique=True)
    name = models.CharField(_("Full Name"), max_length=255, null=True, blank=True)
    
    is_active = models.BooleanField(_("Is Active"), default=True)
    is_staff = models.BooleanField(_("Is Staff"), default=False)
    date_joined = models.DateTimeField(_("Date Joined"), auto_now_add=True)

    # NEW: Feature 19: Saved Products (Wishlist)
    saved_products = models.ManyToManyField('app.Product', blank=True, related_name='saved_by_users')

    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    class Meta:
        verbose_name = _("User Account")
        verbose_name_plural = _("User Accounts")

    def __str__(self):
        return self.email









# users/admin.py

from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

# Get the currently active User model
User = get_user_model()

# We need to unregister the default User admin if it was ever registered
# This is a safeguard.
# admin.site.unregister(User)

@admin.register(User)
class UserAccountAdmin(UserAdmin):
    """
    Admin configuration for the custom UserAccount model.
    """
    # Customize the admin interface for your custom user model
    list_display = ('email', 'name', 'is_staff', 'is_active', 'date_joined')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')
    search_fields = ('email', 'name')
    ordering = ('-date_joined',)
    
    # These are the fields shown when creating/editing a user
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('name',)}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    # These fields are shown when creating a user
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'password', 'password2'),
        }),
    )









# orders/views.py








from django.db import transaction
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action

from .models import Order, OrderItem
from .serializers import OrderSerializer
from app.models import Product
from app.permissions import IsStaffOrReadOnly # Import the permission

class OrderViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for viewing and creating orders.
    - Authenticated users can create and view their own orders.
    - Staff users can view all orders and update their status.
    """
    serializer_class = OrderSerializer
    
    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        - Staff can do anything.
        - Authenticated users can create and list/retrieve their own.
        """
        if self.action in ['update', 'partial_update', 'destroy', 'update_status']:
            self.permission_classes = [permissions.IsAdminUser]
        elif self.action in ['create', 'list', 'retrieve']:
            self.permission_classes = [permissions.IsAuthenticated]
        else:
            self.permission_classes = [permissions.IsAdminUser]
        return super().get_permissions()

    def get_queryset(self):
        """
        This view should return a list of all the orders
        for the currently authenticated user, or all orders for staff.
        """
        user = self.request.user
        if user.is_staff:
            return Order.objects.all().prefetch_related('items__product', 'user')
        return Order.objects.filter(user=user).prefetch_related('items__product')

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        # (This method remains the same as before)
        cart_items = request.data.get('cart', [])
        shipping_data = {
            "shipping_address": request.data.get("shipping_address"),
            "city": request.data.get("city"),
            "postal_code": request.data.get("postal_code"),
        }

        if not cart_items:
            return Response({"detail": "Cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

        total_price = 0
        order_items_data = []
        products_to_update = []

        for item in cart_items:
            try:
                product = Product.objects.get(id=item['product_id'])
                quantity = int(item['quantity'])
                if quantity <= 0: return Response({"detail": f"Invalid quantity for {product.name}."}, status=status.HTTP_400_BAD_REQUEST)
                if product.stock_quantity < quantity: return Response({"detail": f"Not enough stock for {product.name}."}, status=status.HTTP_400_BAD_REQUEST)
                total_price += product.price * quantity
                order_items_data.append({'product': product, 'quantity': quantity, 'price': product.price})
                product.stock_quantity -= quantity
                products_to_update.append(product)
            except Product.DoesNotExist: return Response({"detail": f"Product with id {item['product_id']} not found."}, status=status.HTTP_404_NOT_FOUND)
            except (KeyError, TypeError, ValueError): return Response({"detail": "Invalid cart item format."}, status=status.HTTP_400_BAD_REQUEST)

        order = Order.objects.create(user=request.user, total_price=total_price, **shipping_data)
        order_items_to_create = [OrderItem(order=order, **data) for data in order_items_data]
        OrderItem.objects.bulk_create(order_items_to_create)
        Product.objects.bulk_update(products_to_update, ['stock_quantity'])

        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # NEW: Custom action for staff to update order status
    @action(detail=True, methods=['post'], url_path='update-status')
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')

        # Validate the new status
        valid_statuses = [choice[0] for choice in Order.STATUS_CHOICES]
        if new_status not in valid_statuses:
            return Response({'detail': f'Invalid status. Must be one of {valid_statuses}'}, status=status.HTTP_400_BAD_REQUEST)

        order.status = new_status
        order.save()
        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)









# orders/serializers.py








from rest_framework import serializers
from .models import Order, OrderItem
from app.serializers import ProductListSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user_email', 'total_price', 'status', 'created_at',
            'shipping_address', 'city', 'postal_code', 'items'
        ]

class CreateOrderSerializer(serializers.ModelSerializer):
    # This serializer will be used to create an order from the cart data
    # We will expand on this when we build the checkout view
    class Meta:
        model = Order
        fields = ['shipping_address', 'city', 'postal_code']








# orders/models.py








from django.db import models
from django.conf import settings
from app.models import Product

class Order(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Basic shipping information
    shipping_address = models.CharField(max_length=255, default='')
    city = models.CharField(max_length=100, default='')
    postal_code = models.CharField(max_length=20, default='')
    
    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Order {self.id} by {self.user.name if self.user else 'Guest'}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2) # Price at the time of order

    def __str__(self):
        return f"{self.quantity} of {self.product.name}"









# orders/admin.py








from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    raw_id_fields = ['product'] # Use a raw ID field for easier product selection
    readonly_fields = ('price',)
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'status', 'total_price', 'created_at', 'shipping_address')
    list_filter = ('status', 'created_at')
    list_editable = ('status',)
    search_fields = ('id', 'user__name', 'user__email', 'shipping_address')
    inlines = [OrderItemInline]
    readonly_fields = ('user', 'total_price', 'created_at')

    def has_add_permission(self, request):
        return False # Orders should be created from the frontend












# backend/urls.py





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











# settings.py









"""
Django settings for backend project.
"""
from pathlib import Path
import os
from datetime import timedelta # Import timedelta for JWT settings

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-your-secret-key-here' # Replace with your actual secret key

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'unfold',  # Add this before django.contrib.admin
    'unfold.contrib.filters',
    'unfold.contrib.forms',

    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # ... rest of your apps
    'rest_framework',
    'rest_framework_simplejwt',
    'djoser',
    'corsheaders',
    "solo",
    'django_filters',
    'app',
    'users',
    'orders',
]


MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # Must be high up
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'media/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'media/static')]
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# --- REST FRAMEWORK and DJOSER SETTINGS ---

# NEW: Updated REST_FRAMEWORK settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    # Feature 10: Pagination
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 12, # 12 products per page
    # Feature 11: Filtering
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend'],
}

# NEW: Add Simple JWT settings for token lifetime, etc.
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "AUTH_HEADER_TYPES": ("Bearer",),
}


DJOSER = {
    'LOGIN_FIELD': 'email', # Use email for login instead of username
    'USER_CREATE_PASSWORD_RETYPE': True,
    'USERNAME_CHANGED_EMAIL_CONFIRMATION': True,
    'PASSWORD_CHANGED_EMAIL_CONFIRMATION': True,
    'SEND_CONFIRMATION_EMAIL': True,
    'SET_USERNAME_RETYPE': True,
    'SET_PASSWORD_RETYPE': True,
    'PASSWORD_RESET_CONFIRM_URL': 'password/reset/confirm/{uid}/{token}',
    'USERNAME_RESET_CONFIRM_URL': 'email/reset/confirm/{uid}/{token}',
    'ACTIVATION_URL': 'activate/{uid}/{token}',
    'SEND_ACTIVATION_EMAIL': True,
    'SERIALIZERS': {
        'user_create': 'users.serializers.UserCreateSerializer', # Changed to users app
        'user': 'users.serializers.UserSerializer', # Changed to users app
        'current_user': 'users.serializers.UserSerializer', # Changed to users app
    }
}


AUTH_USER_MODEL = 'users.UserAccount'
# --- CORS SETTINGS ---

# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:5173",
#     "http://127.0.0.1:5173",
# ]

CORS_ALLOW_ALL_ORIGINS = True

# --- EMAIL BACKEND SETTINGS ---

# For development, we'll just print emails to the console.
# For production, you'd configure a real SMTP service.
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'





EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'mail.waterfoundationbd.com'
EMAIL_HOST_USER = 'mail@waterfoundationbd.com' # use any valid webmail address
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
EMAIL_HOST_PASSWORD = '%B=OwMVL$O4}'
EMAIL_PORT = 465
EMAIL_USE_SSL = True
EMAIL_USE_TLS = False

DOMAIN = 'amardokan.vercel.app'

SITE_NAME = 'The প্রফেসর'














# app/views.py









from rest_framework import viewsets, generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework import serializers

from .models import Category, Product, ProductImage, SiteConfiguration, Color, Size, Review, HeroSlide
from .serializers import (
    CategorySerializer, ProductListSerializer, ProductAdminSerializer,
    SiteConfigurationSerializer, ColorSerializer, SizeSerializer,
    ReviewSerializer, HeroSlideSerializer
)
from .permissions import IsStaffOrReadOnly

class HeroSlideViewSet(viewsets.ModelViewSet):
    queryset = HeroSlide.objects.all()
    serializer_class = HeroSlideSerializer
    permission_classes = [IsStaffOrReadOnly]
    pagination_class = None
    
    def get_queryset(self):
        if self.request.user and self.request.user.is_staff:
            return HeroSlide.objects.all()
        return HeroSlide.objects.filter(is_active=True)

    # FIXED: This method injects the request context into the serializer,
    # which is necessary for the SerializerMethodField to build the full URL.
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

class SiteConfigurationView(generics.RetrieveUpdateAPIView):
    serializer_class = SiteConfigurationSerializer
    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS: return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
    def get_object(self):
        return SiteConfiguration.objects.get()

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    permission_classes = [IsStaffOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_featured']

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Review.objects.none()
    def perform_create(self, serializer):
        product_id = self.request.data.get('product')
        product = Product.objects.get(id=product_id)
        if Review.objects.filter(product=product, user=self.request.user).exists():
            raise serializers.ValidationError('You have already reviewed this product.')
        serializer.save(user=self.request.user, product=product)

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(is_available=True).prefetch_related('colors', 'sizes').distinct()
    serializer_class = ProductListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = { 'category__slug': ['exact'], 'colors__name': ['in'], 'sizes__name': ['in'], 'price': ['gte', 'lte'], 'is_featured': ['exact'], 'tag': ['exact'], }
    search_fields = ['name', 'description', 'category__name']
    ordering_fields = ['price', 'created_at', 'name']

class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all().prefetch_related('images', 'colors', 'sizes', 'reviews')
    serializer_class = ProductAdminSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'pk'

class ProductAdminViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().prefetch_related('images', 'colors', 'sizes', 'reviews')
    serializer_class = ProductAdminSerializer
    permission_classes = [permissions.IsAdminUser]
    
    @action(detail=True, methods=['delete'], url_path='images/(?P<image_id>[^/.]+)')
    def delete_image(self, request, pk=None, image_id=None):
        try:
            image = ProductImage.objects.get(id=image_id, product_id=pk)
            image.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ProductImage.DoesNotExist:
            return Response({'detail': 'Image not found.'}, status=status.HTTP_404_NOT_FOUND)

class ColorViewSet(viewsets.ModelViewSet):
    queryset = Color.objects.all()
    serializer_class = ColorSerializer
    permission_classes = [IsStaffOrReadOnly]
    pagination_class = None

class SizeViewSet(viewsets.ModelViewSet):
    queryset = Size.objects.all()
    serializer_class = SizeSerializer
    permission_classes = [IsStaffOrReadOnly]
    pagination_class = None









# app/urls.py













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










# app/signals.py












# app/signals.py

import os
from django.db import models
from django.dispatch import receiver
from .models import Product, ProductImage, Category

# This signal handles deleting the old main image when a Product is updated with a new one.
@receiver(models.signals.pre_save, sender=Product)
def auto_delete_file_on_change(sender, instance, **kwargs):
    """
    Deletes the old file from the filesystem when a Product object is updated
    with a new file.
    """
    if not instance.pk:
        return False

    try:
        old_file = sender.objects.get(pk=instance.pk).image
    except sender.DoesNotExist:
        return False

    new_file = instance.image
    if old_file and not old_file == new_file:
        if os.path.isfile(old_file.path):
            os.remove(old_file.path)

# This signal handles deleting the main image when a Product is deleted.
@receiver(models.signals.post_delete, sender=Product)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    """
    Deletes the file from the filesystem when the corresponding Product object is deleted.
    """
    if instance.image:
        if os.path.isfile(instance.image.path):
            os.remove(instance.image.path)

# This signal handles deleting a gallery image when a ProductImage object is deleted.
@receiver(models.signals.post_delete, sender=ProductImage)
def auto_delete_gallery_image_on_delete(sender, instance, **kwargs):
    """
    Deletes the file from the filesystem when the corresponding ProductImage object is deleted.
    """
    if instance.image:
        if os.path.isfile(instance.image.path):
            os.remove(instance.image.path)

# This signal handles deleting the old category image when a Category is updated.
@receiver(models.signals.pre_save, sender=Category)
def auto_delete_category_file_on_change(sender, instance, **kwargs):
    if not instance.pk:
        return False
    try:
        old_file = sender.objects.get(pk=instance.pk).image
    except sender.DoesNotExist:
        return False
    
    if old_file and not old_file == instance.image:
        if os.path.isfile(old_file.path):
            os.remove(old_file.path)

# This signal handles deleting the category image when a Category is deleted.
@receiver(models.signals.post_delete, sender=Category)
def auto_delete_category_file_on_delete(sender, instance, **kwargs):
    if instance.image:
        if os.path.isfile(instance.image.path):
            os.remove(instance.image.path)








# app/serializers.py











from rest_framework import serializers
from .models import (
    SiteConfiguration, 
    Category, 
    Color, 
    Size, 
    Product, 
    ProductImage, 
    Review,
    HeroSlide
)
from users.serializers import UserSerializer

# --- Serializers ---

# UPDATED: This serializer now correctly builds the full image URL.
class HeroSlideSerializer(serializers.ModelSerializer):
    background_image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = HeroSlide
        fields = [
            'id', 'title', 'subtitle', 'background_image', 'background_image_url', 
            'button_text', 'button_link', 'is_active'
        ]
        extra_kwargs = {
            # This makes the image field optional on updates and not shown on GET requests
            'background_image': {'required': False, 'write_only': True}
        }

    def get_background_image_url(self, obj):
        request = self.context.get('request')
        if obj.background_image and request:
            return request.build_absolute_uri(obj.background_image.url)
        return None

class SiteConfigurationSerializer(serializers.ModelSerializer):
    logo_url = serializers.ImageField(source='logo', read_only=True)
    about_image_url = serializers.ImageField(source='about_image', read_only=True)
    class Meta:
        model = SiteConfiguration
        fields = [
            'id', 'site_name', 'logo', 'logo_url', 'about_title', 'about_story', 
            'about_mission', 'about_image', 'about_image_url', 'contact_email', 
            'contact_phone', 'contact_address', 'brand_video_url'
        ]
        extra_kwargs = {
            'logo': {'required': False},
            'about_image': {'required': False}
        }

class CategorySerializer(serializers.ModelSerializer):
    image_url = serializers.ImageField(source='image', read_only=True)
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'image', 'image_url', 'is_featured']
        read_only_fields = ['slug']
        extra_kwargs = {
            'image': {'required': False}
        }

class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = ['id', 'name', 'hex_code']

class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = ['id', 'name']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image']

class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Review
        fields = ['id', 'user', 'rating', 'comment', 'created_at']

class ProductListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    image_url = serializers.SerializerMethodField()
    avg_rating = serializers.FloatField(read_only=True)
    reviews_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'price', 'image_url', 'category_name', 'tag', 
            'is_available', 'stock_quantity', 'avg_rating', 'reviews_count'
        ]
    
    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None

class ProductAdminSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    colors = ColorSerializer(many=True, read_only=True)
    sizes = SizeSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    avg_rating = serializers.FloatField(read_only=True)
    reviews_count = serializers.IntegerField(read_only=True)
    
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )
    color_ids = serializers.PrimaryKeyRelatedField(
        queryset=Color.objects.all(), source='colors', many=True, write_only=True, required=False
    )
    size_ids = serializers.PrimaryKeyRelatedField(
        queryset=Size.objects.all(), source='sizes', many=True, write_only=True, required=False
    )
    
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )
    
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'price', 'image', 'image_url',
            'category', 'images', 'colors', 'sizes', 'reviews',
            'stock_quantity', 'is_available', 'is_featured', 'tag', 'video_url',
            'category_id', 'color_ids', 'size_ids', 'uploaded_images',
            'avg_rating', 'reviews_count'
        ]
        read_only_fields = ['slug', 'image_url', 'reviews', 'images']
        
        extra_kwargs = {
            'image': {'required': False}
        }

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        product = super().create(validated_data)
        for image in uploaded_images:
            ProductImage.objects.create(product=product, image=image)
        return product

    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        product = super().update(instance, validated_data)
        for image in uploaded_images:
            ProductImage.objects.create(product=product, image=image)
        return product
















# app/permissions.py









from rest_framework import permissions

class IsStaffOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow staff users to edit an object.
    Read-only access is allowed for any request (authenticated or not).
    """

    def has_permission(self, request, view):
        # Allow all GET, HEAD, or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to staff users.
        return request.user and request.user.is_staff













# app/models.py








from django.db import models
from django.db.models import Avg, Count
from django.utils.text import slugify
from django.conf import settings
from solo.models import SingletonModel
import random
import string

# --- New Product Manager ---
class ProductManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().annotate(
            avg_rating=Avg('reviews__rating'),
            reviews_count=Count('reviews')
        )

# --- Models ---

class HeroSlide(models.Model):
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=300, blank=True)
    background_image = models.ImageField(upload_to='hero_slides/')
    button_text = models.CharField(max_length=50, default="Shop Now")
    button_link = models.CharField(max_length=255, help_text="A URL or a slug for a page (e.g., /shop?category=new-arrivals)")
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.title

class SiteConfiguration(SingletonModel):
    site_name = models.CharField(max_length=255, default='The প্রফেসর')
    logo = models.ImageField(upload_to='site/', blank=True, null=True)
    about_title = models.CharField(max_length=255, blank=True)
    about_story = models.TextField(blank=True)
    about_mission = models.TextField(blank=True)
    about_image = models.ImageField(upload_to='site/', blank=True, null=True)
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)
    contact_address = models.CharField(max_length=255, blank=True)
    brand_video_url = models.URLField(blank=True, null=True, help_text="URL for the main brand video (e.g., on YouTube, Vimeo).")

    def __str__(self):
        return "Site Configuration"

    class Meta:
        verbose_name = "Site Configuration"

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True, help_text="Optional image for the category.")
    is_featured = models.BooleanField(default=False, help_text="Featured categories will be displayed on the homepage.")

    class Meta:
        verbose_name_plural = "Categories"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Color(models.Model):
    name = models.CharField(max_length=50, unique=True)
    hex_code = models.CharField(max_length=7, unique=True, help_text="e.g., #FFFFFF")
    def __str__(self): return self.name

class Size(models.Model):
    name = models.CharField(max_length=50, unique=True, help_text="e.g., S, M, L, XL")
    def __str__(self): return self.name

class Product(models.Model):
    TAG_CHOICES = (('new', 'New'), ('hot', 'Hot'), ('special', 'Special'))
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='products/', help_text="This will be the main display image.")
    colors = models.ManyToManyField(Color, blank=True)
    sizes = models.ManyToManyField(Size, blank=True)
    stock_quantity = models.PositiveIntegerField(default=10)
    is_available = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    tag = models.CharField(max_length=10, choices=TAG_CHOICES, null=True, blank=True)
    video_url = models.URLField(blank=True, null=True, help_text="Optional: A URL to a product video (e.g., on YouTube).")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = ProductManager()

    def save(self, *args, **kwargs):
        if not self.slug: self.slug = slugify(self.name)
        original_slug = self.slug
        queryset = Product.objects.all()
        if self.pk: queryset = queryset.exclude(pk=self.pk)
        while queryset.filter(slug=self.slug).exists():
            random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=4))
            self.slug = f"{original_slug}-{random_suffix}"
        super().save(*args, **kwargs)
    def __str__(self): return self.name

class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products/gallery/')
    def __str__(self): return f"Image for {self.product.name}"

class Review(models.Model):
    product = models.ForeignKey(Product, related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField(choices=[(i, str(i)) for i in range(1, 6)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        unique_together = ('product', 'user')
        ordering = ['-created_at']
    def __str__(self): return f"Review by {self.user.name} for {self.product.name}"











# app/apps.py





# app/apps.py

from django.apps import AppConfig

class AppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'app'

    def ready(self):
        # Import signals so they are connected when the app is ready
        import app.signals








# app/admin.py





from django.contrib import admin
from .models import (
    SiteConfiguration, 
    Category, 
    Color, 
    Size, 
    Product, 
    ProductImage, 
    Review,
    HeroSlide # Import the new model
)

# Register the new HeroSlide model
@admin.register(HeroSlide)
class HeroSlideAdmin(admin.ModelAdmin):
    list_display = ('title', 'button_link', 'is_active')
    list_editable = ('is_active',)

# Register the singleton SiteConfiguration model
admin.site.register(SiteConfiguration)

# UPDATED: Added 'is_featured' to list_display and list_editable
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_featured')
    list_editable = ('is_featured',)
    prepopulated_fields = {'slug': ('name',)}

# Register the simple models
admin.site.register(Color)
admin.site.register(Size)

# Use an inline so we can add multiple images from the Product admin page
class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1 # Number of extra empty forms to display
    readonly_fields = ('image_preview',)

    def image_preview(self, obj):
        from django.utils.html import mark_safe
        return mark_safe(f'<img src="{obj.image.url}" width="100" />') if obj.image else ""
    image_preview.short_description = 'Preview'


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'stock_quantity', 'is_available', 'is_featured', 'tag')
    list_filter = ('is_available', 'is_featured', 'category', 'tag', 'colors', 'sizes')
    list_editable = ('price', 'stock_quantity', 'is_available', 'is_featured', 'tag')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductImageInline]

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('product', 'user', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('user__name', 'product__name', 'comment')
    readonly_fields = ('user', 'product', 'rating', 'comment', 'created_at')

    def has_add_permission(self, request):
        return False # Reviews should be added from the frontend, not admin













































