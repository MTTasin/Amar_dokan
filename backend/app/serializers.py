from .models import Carousel
from rest_framework import serializers
from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
from rest_framework_guardian.serializers import ObjectPermissionsAssignmentMixin


User = get_user_model()


class UserSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'is_active', 'is_staff, is_superuser')


class CarouselSerializer(ObjectPermissionsAssignmentMixin, serializers.ModelSerializer):
    class Meta:
        model = Carousel
        fields = '__all__'

    def get_permissions_map(self, created):
        current_user = self.context['request'].user
        staffs = User.objects.filter(is_staff=True)
        supervisors = User.objects.filter(is_superuser=True)

        return {
            'view_carousel': [current_user, supervisors, staffs],
            'change_carousel': [supervisors, staffs],
            'add_carousel': [supervisors, staffs],
            'delete_carousel': [supervisors, staffs],
        }