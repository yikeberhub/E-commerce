import requests
from django.conf import settings

def verify_payment(transaction_id):
    url = f"https://api.chapa.co/v1/transaction/verify/{transaction_id}"
    headers = {
        'Authorization': f'Bearer {settings.CHAPA_SECRET_KEY}',
    }
    
    print('transaction ref', transaction_id)
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        print('data', data)
        return data
    else:
        print('Error verifying payment:', response.status_code, response.text)
        return None
