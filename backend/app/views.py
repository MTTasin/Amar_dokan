from .serializers import CarouselSerializer, ProductSerializer, OrderSerializer
from .models import Carousel, Product, Order
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from .permission import IsOwnerOrReadOnly




# Create your views here.


class CarouselViewSet(viewsets.ModelViewSet):
    serializer_class = CarouselSerializer
    queryset = Carousel.objects.all()
    permission_classes = [IsOwnerOrReadOnly]
    
    

    def create(self, request, *args, **kwargs):
        
        if isinstance(request.data, list):
            serializer = self.get_serializer(data=request.data, many=True)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            return super().create(request, *args, **kwargs)

        



class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    queryset = Product.objects.all()
    permission_classes = [IsOwnerOrReadOnly]

    def create(self, request, *args, **kwargs):
        
        if isinstance(request.data, list):
            serializer = self.get_serializer(data=request.data, many=True)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            return super().create(request, *args, **kwargs)
        

    def get_queryset(self):
        queryset = self.queryset
        limit = self.request.query_params.get('limit')
        name = self.request.query_params.get('name')
        category = self.request.query_params.get('category')
        sku = self.request.query_params.get('sku')
        pagination = self.request.query_params.get('page')

        if name:
            queryset = queryset.filter(name__icontains=name)
        if category:
            queryset = queryset.filter(category__icontains=category)
        if sku:
            queryset = queryset.filter(sku__icontains=sku)
        
        if pagination:
            page_size = 10
            start = int(pagination) * page_size
            end = start + page_size
            queryset = queryset[start:end]
        elif limit:
            queryset = queryset[:int(limit)]
            
        return queryset

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    queryset = Order.objects.all()
    permission_classes = [IsOwnerOrReadOnly]