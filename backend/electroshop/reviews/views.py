from django.shortcuts import render
from rest_framework import generics

from .models import Review

class ReviewSerializer:
    pass

# Create your views here.

class ReviewListView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        product_id = self.kwargs['product_id']
        return Review.objects.filter(product_id=product_id)

class ReviewCreateView(generics.CreateAPIView):
    serializer_class = ReviewSerializer

class ReviewUpdateView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReviewSerializer
    queryset = Review.objects.all()

class ReviewDeleteView(generics.DestroyAPIView):
    serializer_class = ReviewSerializer
    queryset = Review.objects.all()