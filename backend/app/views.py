from django.shortcuts import render
from .serializers import CarouselSerializer
from .models import Carousel
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination

# Create your views here.


class CarouselViewSet(viewsets.ModelViewSet):
    serializer_class = CarouselSerializer
    queryset = Carousel.objects.all()

    def update(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)