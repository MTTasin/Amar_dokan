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
