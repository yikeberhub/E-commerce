# import requests

def process_payment(order, payment_method, payment_gateway):
    """
    Processes the payment for an order using the specified payment method and gateway.
    Returns a dictionary containing transaction details if successful, or None if failed.
    """
    try:
        # Define the payment endpoint based on the payment gateway
        if payment_gateway == 'stripe':
            url = 'https://api.stripe.com/v1/charges'
            data = {
                'amount': int(order.total_price * 100),  # Convert to cents
                'currency': 'usd',  # Use appropriate currency
                'source': payment_method,  # This should be the token returned by Stripe
                'description': f'Charge for Order {order.id}'
            }
            headers = {
                'Authorization': f'Bearer {YOUR_STRIPE_SECRET_KEY}'
            }
            
            # Make the API request to Stripe
            response = requests.post(url, data=data, headers=headers)

            if response.status_code == 200:
                # Parse the successful response
                response_data = response.json()
                return {
                    'transaction_id': response_data['id'],  # Transaction ID from Stripe
                    'status': response_data['status']  # Status of the payment
                }
            else:
                # Handle payment failure
                print(f'Error: {response.text}')
                return None
        
        elif payment_gateway == 'paypal':
            # Implement PayPal payment logic here
            # Example:
            # response = requests.post(paypal_url, data=paypal_data, headers=paypal_headers)
            pass
        
        else:
            print('Unsupported payment gateway')
            return None

    except Exception as e:
        print(f'Payment processing error: {str(e)}')
        return None
