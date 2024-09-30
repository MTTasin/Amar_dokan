from django.db import models
from django.contrib.auth.models import User, AbstractBaseUser, PermissionsMixin, BaseUserManager


# Create your models here.


class Carousel(models.Model):
    name = models.CharField(max_length=100)
    image = models.CharField(max_length=1000)
    link = models.CharField(max_length=100, blank=True, null=True)


    def __str__(self):
        return self.name




class Product(models.Model):
    title = models.CharField(max_length=100) 
    description = models.TextField()
    category = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discountPercentage = models.DecimalField(max_digits=5, decimal_places=2)
    rating = models.DecimalField(max_digits=3, decimal_places=2)
    stock = models.IntegerField()
    tags = models.CharField(max_length=100)
    brand = models.CharField(max_length=100)
    sku = models.CharField(max_length=100)
    weight = models.DecimalField(max_digits=5, decimal_places=2)
    dimensions = models.JSONField()
    warrantyInformation = models.CharField(max_length=100)
    shippingInformation = models.CharField(max_length=100)
    availabilityStatus = models.CharField(max_length=100)
    reviews = models.ManyToManyField("ProductReview", verbose_name=("reviews"))
    returnPolicy = models.CharField(max_length=100)
    minimumOrderQuantity = models.IntegerField()



    def __str__(self):
        return self.name
    

class ProductReview(models.Model):
    review_for = models.ForeignKey("Product", on_delete=models.CASCADE, verbose_name=("sku"))
    rating = models.IntegerField()
    comment = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    reviewerName = models.ForeignKey("UserAccount", on_delete=models.CASCADE, verbose_name=("first_name" + " " + "last_name"))
    reviewerEmail = models.EmailField()



# Custom User model codes below

class UserAccountManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')

        if not first_name:
            raise ValueError('Users must have a first name')
        
        if not last_name:
            raise ValueError('Users must have a last name')
      
        
        email = self.normalize_email(email)
        user = self.model(email=email, first_name=first_name, last_name=last_name, **extra_fields)

        user.set_password(password)
        user.save(using=self._db)

        return user
    
    def create_superuser(self, email, first_name, last_name, password):
        user = self.create_user(email, first_name, last_name, password)

        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)

        return user
    
class UserAccount(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'date_joined', 'is_staff', 'is_active']

    def get_full_name(self):
        return self.first_name + ' ' + self.last_name
    
    def get_short_name(self):
        return self.first_name
    
    def __str__(self):
        return self.email
