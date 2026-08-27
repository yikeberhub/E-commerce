from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import CustomUser, Address


def make_customer(email='customer@test.com'):
    return CustomUser.objects.create_user(
        username=email.split('@')[0], email=email, password='pass12345', role='customer',
    )


ADDRESS_PAYLOAD = {
    'full_name': 'Test Customer', 'phone_number': '0911111111',
    'kebele': '01', 'city': 'Addis Ababa', 'region': 'Addis Ababa', 'woreda': '03',
}


class CreateAddressDefaultingTests(APITestCase):
    """Covers the checkout bug where a brand-new address was created
    successfully but never shown, because it wasn't flagged default and
    nothing else was — the shipping form silently rendered blank."""

    def setUp(self):
        self.customer = make_customer()
        self.client.force_authenticate(self.customer)
        self.url = reverse('create-address')

    def test_first_address_is_auto_defaulted(self):
        response = self.client.post(self.url, ADDRESS_PAYLOAD, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['is_default'])

        address = Address.objects.get(id=response.data['id'])
        self.assertTrue(address.is_default)

    def test_second_address_does_not_touch_existing_default(self):
        first = self.client.post(self.url, ADDRESS_PAYLOAD, format='json').data
        second = self.client.post(self.url, {**ADDRESS_PAYLOAD, 'city': 'Bahir Dar'}, format='json').data

        self.assertTrue(Address.objects.get(id=first['id']).is_default)
        self.assertFalse(Address.objects.get(id=second['id']).is_default)
