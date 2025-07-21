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
