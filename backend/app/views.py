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
        limit = self.request.query_params.get('limit')
        name = self.request.query_params.get('name')
        category = self.request.query_params.get('category')
        sku = self.request.query_params.get('sku')
        pagination = self.request.query_params.get('page')
        

        if limit:
            return self.queryset.all()[:int(limit)]
        elif name:
            return self.queryset.filter(name__icontains=name)
        elif category:
            return self.queryset.filter(category__icontains=category)
        elif sku:
            return self.queryset.filter(sku__icontains=sku)
        elif pagination:
            return self.queryset.all()[int(pagination)*10:int(pagination)*10+10]
        else:
            return self.queryset.all()

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    queryset = Order.objects.all()
    permission_classes = [IsOwnerOrReadOnly]