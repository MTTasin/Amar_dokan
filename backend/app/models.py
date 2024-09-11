from django.db import models

# Create your models here.


class Carousel(models.Model):
    name = models.CharField(max_length=100)
    image = models.CharField(max_length=1000)
    link = models.CharField(max_length=100, blank=True, null=True)


    def __str__(self):
        return self.name