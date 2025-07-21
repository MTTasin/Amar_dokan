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
