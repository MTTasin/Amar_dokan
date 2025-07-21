from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils.translation import gettext_lazy as _

class UserAccountManager(BaseUserManager):
    """
    Custom user model manager where email is the unique identifier
    for authentication instead of usernames.
    """
    def create_user(self, email, password=None, **extra_fields):
        """
        Create and save a User with the given email and password.
        """
        if not email:
            raise ValueError(_('The Email must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        """
        Create and save a SuperUser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        
        return self.create_user(email, password, **extra_fields)

class UserAccount(AbstractBaseUser, PermissionsMixin):
    """
    Custom User Account model.
    """
    email = models.EmailField(_("Email Address"), max_length=255, unique=True)
    name = models.CharField(_("Full Name"), max_length=255, null=True, blank=True)
    
    is_active = models.BooleanField(_("Is Active"), default=True)
    is_staff = models.BooleanField(_("Is Staff"), default=False)
    date_joined = models.DateTimeField(_("Date Joined"), auto_now_add=True)

    # NEW: Feature 19: Saved Products (Wishlist)
    saved_products = models.ManyToManyField('app.Product', blank=True, related_name='saved_by_users')

    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    class Meta:
        verbose_name = _("User Account")
        verbose_name_plural = _("User Accounts")

    def __str__(self):
        return self.email
