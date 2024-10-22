# views.py

import uuid
import requests
import json
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from rest_framework.decorators import api_view

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,generics

from orders.models import Order
from .models import Payment,Transaction
from .serializers import PaymentSerializer,TransactionSerializer

class CreatePaymentView(APIView):
    def post(self, request):
        order_id = request.data.get('order_id')
        amount = request.data.get('amount')
        # payment_gateway = request.data.get('payment_gateway')
        # payment_method = request.data.get('payment_method')
        email = request.data.get('email')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        phone_number = request.data.get('phone_number')
        print('hello yike')

        if not all([amount, email, order_id]):
            print('not all send')
            return Response({"error": "Amount, email, and order_id are required."}, status=status.HTTP_400_BAD_REQUEST)

        tx_ref = f"txn-{uuid.uuid4().hex[:8]}"

       
        headers = {
            'Authorization': f'Bearer {settings.CHAPA_SECRET_KEY}',
            'Content-Type': 'application/json'
        }
        payment_data = {
            "amount": float(amount),
            "currency": "ETB",
            "email": email,
            "callback_url": f'http://localhost:8000/payments/callback/{order_id}/',
            "first_name": first_name,
            "last_name": last_name,
            "phone_number": phone_number,
            "tx_ref": tx_ref,
            "return_url": f"http://localhost:3000/payment/confirm?trx_ref={tx_ref}"
        }

        # Initialize payment via API
        try:
            print('try block')
            response = requests.post(settings.CHAPA_API_URL, json=payment_data, headers=headers)
            print('hay yike')
            response_data = response.json()
            print('response',response_data)

            if response.ok and response_data.get('status') == 'success':
                checkout_url = response_data['data']['checkout_url']
                print('url',checkout_url)
                return Response({"data": {"checkout_url": checkout_url}}, status=status.HTTP_200_OK)

            return Response(response_data, status=response.status_code)

        except requests.exceptions.RequestException as e:
            print('error is ,',str(e))
            return Response({"error": "Payment initialization failed."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

@csrf_exempt
@api_view(['POST'])
def chapa_callback(request, order_id):
    if request.method == 'POST':
        print('callback is called')
        try:
            webhook_data = json.loads(request.body)
            event = webhook_data.get('event')
            tx_ref = webhook_data.get('tx_ref')
            payment_status = webhook_data.get('status')
            amount = webhook_data.get('amount')
            currency = webhook_data.get('currency')
            charge = webhook_data.get('charge')
            payment_method = webhook_data.get('payment_method')
            
            print('wabehook body',webhook_data)

            if event == "charge.success" and payment_status == "success":
                order = get_object_or_404(Order, id=order_id)
                order.status = 'processing'
                order.save()

                chapa_sub_method = payment_method if payment_method in ['telebirr', 'cbe'] else None
                
                payment = Payment.objects.create(
                    order=order,
                    transaction_id=tx_ref,
                    amount=float(amount),
                    currency=currency,
                    charge=float(charge),
                    payment_method='chapa',
                    chapa_sub_method=chapa_sub_method, 
                    payment_status='completed',
                    
                )

                print('Payment Info:', payment)
                return Response({"message": "Payment recorded successfully", "trx_ref": tx_ref, "status": payment_status}, status=200)

            print(f"Payment failed or event not processed: {payment_status}")
            return Response({"message": "Payment failed or event not processed"}, status=status.HTTP_400_BAD_REQUEST)

        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print("Error processing webhook:", str(e))
            return Response({"error": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({"error": "Invalid request method"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['GET'])
def check_payment_status(request):
    transaction_id = request.GET.get('transaction_id')
    print('id',transaction_id)

    if not transaction_id:
        return Response({"error": "transaction_id is required."}, status=400)

    try:
        print('try block')
        payment = Payment.objects.filter(transaction_id=transaction_id).first()
        print('payment',payment)
        serializer =PaymentSerializer(payment,many=False)
        return Response({"payment": serializer.data}, status=200)
    except Payment.DoesNotExist:
        return Response({"error": "Payment not found."}, status=404)
    
    
class TransactionListCreateView(generics.ListCreateAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

class TransactionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer