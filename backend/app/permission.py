from rest_framework import permissions
from .models import UserAccount as user


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True  # Allow read-only access for everyone
        else:
            return request.user and (request.user.is_superuser or request.user.is_staff)

    def has_object_permission(self, request, view, obj):
        # Assuming CustomUser model has a field named 'role' to determine user roles
        if request.method in permissions.SAFE_METHODS:
            return True  # Allow read-only access for everyone
        else:
            return request.user and (request.user.is_superuser or request.user.is_staff or request.user.role == 'superuser')