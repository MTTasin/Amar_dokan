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
