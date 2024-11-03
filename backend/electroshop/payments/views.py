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
        order_id = request.data.get('order_id')
        amount = request.data.get('amount')
        email = request.data.get('email')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        phone_number = request.data.get('phone_number')

        if not all([amount, email, order_id]):
            return Response({"error": "Amount, email, and order_id are required."}, status=status.HTTP_400_BAD_REQUEST)

        tx_ref = f"txn-{uuid.uuid4().hex[:8]}"

        # Prepare data for payment initialization
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

        # Initialize payment via SDK
        try:
            response = chapa.initialize(**payment_data)
            if response['status'] == 'success':
                checkout_url = response['data']['checkout_url']
                return Response({"data": {"checkout_url": checkout_url}}, status=status.HTTP_200_OK)

            return Response(response, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": "Payment initialization failed."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@csrf_exempt
@api_view(['GET'])
def chapa_callback(request, order_id):
    if request.method == 'GET':
        print('Callback is called')

        # Extract relevant parameters from the request
        tx_ref = request.GET.get('trx_ref')
        payment_status = request.GET.get('status')

        print('Webhook data:', {
            'tx_ref': tx_ref,
            'payment_status': payment_status,
        })

        order = get_object_or_404(Order, id=order_id)
        if payment_status == "success":
            # Check if the payment already exists
            payment, created = Payment.objects.get_or_create(
                transaction_id=tx_ref,
                defaults={
                    'order': order,
                    'payment_status': 'completed',  # Set to completed upon success
                    'amount': order.total_amount,  # Assuming you have a total_amount field in your Order model
                    'currency': 'ETB',  # Adjust based on your currency logic
                    'payment_gateway': 'chapa',
                    'chapa_sub_method': 'cbe',  # Or whatever method you are using
                }
            )

            if not created:
                print('Payment already exists, updating status.')
                payment.payment_status = 'completed'
                payment.save()

            # Update order status if needed
            order.status = 'processing'  # Adjust based on your flow
            order.save()

            print('Payment Info:', payment)
            return Response({"message": "Payment recorded successfully", "trx_ref": tx_ref}, status=200)

        print(f"Payment failed or event not processed: {payment_status}")
        return Response({"message": "Payment failed or event not processed"}, status=status.HTTP_400_BAD_REQUEST)

    return Response({"error": "Invalid request method"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['GET'])
def check_payment_status(request):
    transaction_id = request.GET.get('transaction_id')

    if not transaction_id:
        return Response({"error": "transaction_id is required."}, status=400)

    try:
        payment = Payment.objects.filter(transaction_id=transaction_id).first()
        if payment:
            response = verify_payment(transaction_id)

            if response and response.get('status') == 'success':
                payment.payment_status = 'completed'
                payment.currency = response['data']['currency']
                payment.amount = response['data']['amount']
                payment.payment_gateway = 'chapa'
                payment.chapa_sub_method = 'cbe'  # Adjust based on the actual sub-method used
                payment.save()

                serializer = PaymentSerializer(payment)
                print('data', serializer.data)
                return Response({"payment": serializer.data}, status=200)

            else:
                print("Verification response:")
                return Response({"error": "Payment verification failed."}, status=400)
        else:
            return Response({"error": "Payment not found."}, status=404)

    except Exception as e:
        print("Error occurred:", str(e))
        return Response({"error": "An error occurred: " + str(e)}, status=500)
