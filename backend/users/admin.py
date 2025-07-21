from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

# Get the currently active User model
User = get_user_model()

# We need to unregister the default User admin if it was ever registered
# This is a safeguard.
# admin.site.unregister(User)

@admin.register(User)
class UserAccountAdmin(UserAdmin):
    """
    Admin configuration for the custom UserAccount model.
    """
    # Customize the admin interface for your custom user model
    list_display = ('email', 'name', 'is_staff', 'is_active', 'date_joined')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')
    search_fields = ('email', 'name')
    ordering = ('-date_joined',)
    
    # These are the fields shown when creating/editing a user
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('name',)}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    # These fields are shown when creating a user
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'password', 'password2'),
        }),
    )

