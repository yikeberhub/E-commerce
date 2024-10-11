# views.py

import uuid
import requests
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from rest_framework.decorators import api_view

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class CreatePaymentView(APIView):
    def post(self, request):
        # Extract required fields from the request data
        amount = request.data.get('amount')
        email = request.data.get('email')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        phone_number = request.data.get('phone_number')
        tx_ref = f"txn-{uuid.uuid4().hex[:8]}"  # Unique transaction reference

        # Validate required fields
        if not amount or not email:
            return Response({"error": "Amount and email are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Log the API key for debugging
        print('Chapa API Key:', settings.CHAPA_API_KEY)

        headers = {
            "Authorization": f"Bearer {settings.CHAPA_API_KEY}",
            "Content-Type": "application/json",
        }
        
        print('Headers:', headers)

        # Prepare the payment data
        payment_data = {
            "amount": float(amount),  # Ensure amount is a float
            "currency": "ETB",  # Ensure this is correct
            "email": email,
            "callback_url": settings.CHAPA_CALLBACK_URL,
            "first_name": first_name or 'John',  # Default values if not provided
            "last_name": last_name or 'Doe',
            "phone_number": phone_number or '09123456789',
            "tx_ref": tx_ref,  # Unique transaction reference
            "return_url" : f"http://localhost:3000/payment/confirm?trx_ref={tx_ref}"
        }

        # Send the request to Chapa API
        try:
            response = requests.post(settings.CHAPA_API_URL, json=payment_data, headers=headers)
            response_data = response.json()
            print('Chapa API Response:', response_data)

            if response.status_code == 200 and response_data.get('status') == 'success':
                print('ok response data',response_data)
                tx_ref = response_data.get('tx_ref')

            # Construct the return URL with transaction details
                return_url = f"http://localhost:3000/payment/confirm?trx_ref={tx_ref}&status=success&amount={amount}"
                checkout_url = response_data['data']['checkout_url']  
                return Response({"data": {"checkout_url": checkout_url}}, status=status.HTTP_200_OK)

            return Response(response_data, status=response.status_code)

        except requests.exceptions.RequestException as e:
            print('Request Exception:', str(e))
            return Response({"error": "Payment initialization failed."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
 
@csrf_exempt
@api_view(['POST', 'GET'])
def chapa_callback(request):
    if request.method == 'POST':
        # Handle POST request (e.g., processing webhook data)
        data = request.data
        print('data come from chapa',data)
        if data.get('status') == 'successful':
            tx_ref = data.get('tx_ref')
            return Response({"message": "Payment successful"}, status=status.HTTP_200_OK)
        return Response({"message": "Payment failed"}, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'GET':
        # Handle GET request
        trx_ref = request.GET.get('trx_ref')
        status = request.GET.get('status')
        print('status',status)
        print('trx_ref',trx_ref)

        if trx_ref and status:
            # You can log or process the information as needed
            print('success implement other logic')
            return Response({"message": "Callback received", "trx_ref": trx_ref, "status": status}, status=200)
        else:
            return Response({"error": "Missing trx_ref or status"}, status=status.HTTP_400_BAD_REQUEST)