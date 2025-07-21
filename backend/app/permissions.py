from rest_framework import permissions

class IsStaffOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow staff users to edit an object.
    Read-only access is allowed for any request (authenticated or not).
    """

    def has_permission(self, request, view):
        # Allow all GET, HEAD, or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to staff users.
        return request.user and request.user.is_staff
