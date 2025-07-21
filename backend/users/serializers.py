from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from djoser.serializers import UserSerializer as BaseUserSerializer
from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

# NEW: Serializer for the Group model (which we'll use for roles)
class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']

class UserCreateSerializer(BaseUserCreateSerializer):
    """
    Serializer for creating users. Inherits from Djoser's default.
    """
    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'name', 'password')

class UserSerializer(BaseUserSerializer):
    """
    Serializer for regular user data retrieval.
    """
    class Meta(BaseUserSerializer.Meta):
        model = User
        fields = ('id', 'email', 'name', 'is_staff')

# NEW: Serializer for admins to manage users
class UserAdminSerializer(serializers.ModelSerializer):
    """
    Serializer for admins to view and manage user details, including their roles.
    """
    groups = GroupSerializer(many=True, read_only=True) # For reading roles
    
    # For writing roles, we'll accept a list of group IDs
    group_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Group.objects.all(), source='groups', write_only=True, required=False
    )

    class Meta:
        model = User
        fields = ('id', 'email', 'name', 'is_staff', 'is_active', 'groups', 'group_ids')
        read_only_fields = ('email',) # Prevent email from being changed
