# from django.shortcuts import render
# from rest_framework import generics
# # Create your views here.


# class PaymentInitiateView(generics.CreateAPIView):
#     serializer_class = PaymentSerializer

# class PaymentConfirmView(generics.GenericAPIView):
#     serializer_class = PaymentSerializer

# class PaymentHistoryView(generics.ListAPIView):
#     serializer_class = PaymentSerializer

#     def get_queryset(self):
#         user = self.request.user
#         return Payment.objects.filter(user=user)