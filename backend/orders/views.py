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
