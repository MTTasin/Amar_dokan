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
