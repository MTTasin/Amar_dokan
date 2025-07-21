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
