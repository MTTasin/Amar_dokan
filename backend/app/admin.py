from django.contrib import admin
from .models import Carousel, UserAccount
# Register your models here.


@admin.register(Carousel)
class CarouselAdmin(admin.ModelAdmin):
    list_display = ('name', 'link')


@admin.register(UserAccount)
class UserAccountAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'is_active', 'is_staff')
