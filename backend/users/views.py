from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

from app.models import Product
from app.serializers import ProductListSerializer
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
