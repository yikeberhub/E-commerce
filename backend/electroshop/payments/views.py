# views.py

import uuid
import requests
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from rest_framework.decorators import api_view

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from orders.models import Order
from .models import Payment
from .serializers import PaymentSerializer

class CreatePaymentView(APIView):
    def post(self, request):
        # Extract required fields from the request data
        order_id = request.data.get('order_id')
        amount = request.data.get('amount')
        email = request.data.get('email')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        phone_number = request.data.get('phone_number')
        tx_ref = f"txn-{uuid.uuid4().hex[:8]}"  

        if not amount or not email or not order_id:
            return Response({"error": "Amount ,email and order are required."}, status=status.HTTP_400_BAD_REQUEST)         
       
        headers = {
            "Authorization": f"Bearer {settings.CHAPA_API_KEY}",
            "Content-Type": "application/json",
        }
        
        # Prepare the payment data
        payment_data = {
            "amount": float(amount), 
            "currency": "ETB", 
            "email": email,
            "callback_url": f'http://localhost:8000/payments/callback/{order_id}/',
            "first_name": first_name , 
            "last_name": last_name,
            "phone_number": phone_number ,
            "tx_ref": tx_ref, 
            "return_url" : f"http://localhost:3000/payment/confirm?trx_ref={tx_ref}"
        }

        try:
            response = requests.post(settings.CHAPA_API_URL, json=payment_data, headers=headers)
            response_data = response.json()

            if response.status_code == 200 and response_data.get('status') == 'success':
                tx_ref = response_data.get('tx_ref')

                # Construct the return URL with transaction details
                checkout_url = response_data['data']['checkout_url']  
                return Response({"data": {"checkout_url": checkout_url}}, status=status.HTTP_200_OK)

            return Response(response_data, status=response.status_code)

        except requests.exceptions.RequestException as e:
            print('Request Exception:', str(e))
            return Response({"error": "Payment initialization failed."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
 
@csrf_exempt
@api_view(['POST', 'GET'])
def chapa_callback(request,order_id):
    
    if request.method == 'GET':
        trx_ref = request.GET.get('trx_ref')
        status = request.GET.get('status')
        if trx_ref and status:
            try:
                order = Order.objects.get(id=order_id)
                print('order',order)
                payment = Payment.objects.create(order=order,transaction_id=trx_ref,payment_status='completed')
                payment.save()
               
                print('payment info:',payment)
                return Response({"message": "Callback received", "trx_ref": trx_ref, "status": status}, status=200)
            except:
                pass
        else:
            return Response({"error": "Missing trx_ref or status"}, status=status.HTTP_400_BAD_REQUEST)
        
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