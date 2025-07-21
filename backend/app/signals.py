# app/signals.py

import os
from django.db import models
from django.dispatch import receiver
from .models import Product, ProductImage, Category

# This signal handles deleting the old main image when a Product is updated with a new one.
@receiver(models.signals.pre_save, sender=Product)
def auto_delete_file_on_change(sender, instance, **kwargs):
    """
    Deletes the old file from the filesystem when a Product object is updated
    with a new file.
    """
    if not instance.pk:
        return False

    try:
        old_file = sender.objects.get(pk=instance.pk).image
    except sender.DoesNotExist:
        return False

    new_file = instance.image
    if old_file and not old_file == new_file:
        if os.path.isfile(old_file.path):
            os.remove(old_file.path)

# This signal handles deleting the main image when a Product is deleted.
@receiver(models.signals.post_delete, sender=Product)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    """
    Deletes the file from the filesystem when the corresponding Product object is deleted.
    """
    if instance.image:
        if os.path.isfile(instance.image.path):
            os.remove(instance.image.path)

# This signal handles deleting a gallery image when a ProductImage object is deleted.
@receiver(models.signals.post_delete, sender=ProductImage)
def auto_delete_gallery_image_on_delete(sender, instance, **kwargs):
    """
    Deletes the file from the filesystem when the corresponding ProductImage object is deleted.
    """
    if instance.image:
        if os.path.isfile(instance.image.path):
            os.remove(instance.image.path)

# This signal handles deleting the old category image when a Category is updated.
@receiver(models.signals.pre_save, sender=Category)
def auto_delete_category_file_on_change(sender, instance, **kwargs):
    if not instance.pk:
        return False
    try:
        old_file = sender.objects.get(pk=instance.pk).image
    except sender.DoesNotExist:
        return False
    
    if old_file and not old_file == instance.image:
        if os.path.isfile(old_file.path):
            os.remove(old_file.path)

# This signal handles deleting the category image when a Category is deleted.
@receiver(models.signals.post_delete, sender=Category)
def auto_delete_category_file_on_delete(sender, instance, **kwargs):
    if instance.image:
        if os.path.isfile(instance.image.path):
            os.remove(instance.image.path)