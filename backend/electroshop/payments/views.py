import uuid
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from orders.models import Order
from .models import Payment
from .serializers import PaymentSerializer
from chapa import Chapa 
from .check_payment import verify_payment

# Initialize Chapa with your secret key
chapa = Chapa(settings.CHAPA_SECRET_KEY)
class CreatePaymentView(APIView):
    def post(self, request):
        amount = request.data.get('total_amount')
        email = request.data.get('email')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        phone_number = request.data.get('phone_number')

        if not all([amount, email,first_name]):
            print('not get email,amount,firstname')
            return Response({"error": "Amount, email, and first name are required."}, status=status.HTTP_400_BAD_REQUEST)
      
        # Unique reference for the entire payment session
        payment_ref = f"multi-txn-{uuid.uuid4().hex[:8]}"
        print('payment ref',payment_ref)
        # Prepare data for payment initialization
        payment_data = {
            "amount": amount,
            "currency": "ETB",
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "phone_number": phone_number,
            "tx_ref": payment_ref,  
            "return_url": f"http://localhost:3000/payment/confirm?txt_ref={payment_ref}"
        }

        # Initialize payment
        try:
            print('try block')
            response = chapa.initialize(**payment_data)
            if response['status'] == 'success':
                checkout_url = response['data']['checkout_url']
                
                print('success full initiation')
                return Response({"data": {"checkout_url": checkout_url, "payment_ref": payment_ref}}, status=status.HTTP_200_OK)

            return Response(response, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": "Payment initialization failed."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@csrf_exempt
@api_view(['GET'])
def chapa_callback(request):
    pass
    # payment_ref = request.GET.get('txt_ref')

    # if payment_status == "success" and transaction_ids:
    #     return Response({"message": "All payments recorded successfully"}, status=status.HTTP_200_OK)

    # return Response({"message": "Payment failed or not processed"}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
def check_payment_status(request,payment_reference):
    
    transaction_ids = request.GET.get('transaction_ids')  
    if not transaction_ids:
        return Response({"error": "transaction_ids are required."}, status=status.HTTP_400_BAD_REQUEST)

    transaction_ids = transaction_ids.split(",")  
    total_amount = 0
    user = None  
    payment_responses = []

    for tx_ref in transaction_ids:
        payment = Payment.objects.filter(transaction_id=tx_ref).first()

        if not payment:
            payment_responses.append({"transaction_id": tx_ref, "status": "error", "message": "Payment not found"})
            continue

        try:
            # Verify payment with Chapa
            response = verify_payment(payment_reference)
            if response and response.get('status') == 'success':
                payment.payment_status = 'completed'
                payment.save()

                # Update associated order status
                order = payment.order
                order.status = 'completed'
                order.save()

                # Update vendor balance
                vendor = order.vendor
                vendor.balance += payment.amount
                vendor.save()

                # Track total amount for deduction from user balance
                total_amount += payment.amount
                if not user:
                    user = order.user


                # Serialize payment response for frontend
                payment_responses.append({"transaction_id": tx_ref, "status": "completed", "payment": PaymentSerializer(payment).data})
            else:
                # If verification fails, mark as failed
                payment.payment_status = 'failed'
                payment.save()
                payment_responses.append({"transaction_id": tx_ref, "status": "failed", "message": "Payment verification failed"})

        except Exception as e:
            payment_responses.append({"transaction_id": tx_ref, "status": "error", "message": f"An error occurred: {str(e)}"})

    # Deduct the total amount from the user's balance after successful payments
    if user:
        user.balance -= total_amount
        user.save()

    return Response({"payments": payment_responses}, status=status.HTTP_200_OK)