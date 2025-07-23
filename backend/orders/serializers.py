from rest_framework import serializers
from .models import Order, OrderItem
from app.serializers import ProductListSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    # Switched to a more detailed serializer to show product info
    product = ProductListSerializer(read_only=True) 
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    # The nested OrderItemSerializer will now provide full product details for each item
    items = OrderItemSerializer(many=True, read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user_email', 'total_price', 'status', 'created_at',
            'shipping_address', 'city', 'postal_code', 'items'
        ]

class CreateOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['shipping_address', 'city', 'postal_code']
