from decimal import Decimal

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from users.models import CustomUser, Address
from vendors.models import Vendor
from .models import Order


def make_customer(email='customer@test.com'):
    return CustomUser.objects.create_user(
        username=email.split('@')[0], email=email, password='pass12345', role='customer',
    )


def make_address(user, **overrides):
    data = dict(
        user=user, full_name='Test Customer', phone_number='0911111111',
        kebele='01', city='Addis Ababa', region='Addis Ababa', woreda='03', street_address='',
    )
    data.update(overrides)
    return Address.objects.create(**data)


class OrderUpdateAddressTests(APITestCase):
    """Covers the 'Failed to set the shipping address' bug: OrderUpdateView
    is what checkout actually calls to attach the chosen address, and it
    must accept address_id, scope it to the order's own owner, and reject
    an unauthenticated caller."""

    def setUp(self):
        self.customer = make_customer()
        self.other_customer = make_customer(email='other@test.com')
        vendor_user = CustomUser.objects.create_user(
            username='vendor', email='vendor@test.com', password='pass12345', role='vendor',
        )
        self.vendor = Vendor.objects.create(user=vendor_user, title='Test Vendor', email='shop@test.com')
        self.order = Order.objects.create(user=self.customer, vendor=self.vendor, total_price=Decimal('100.00'))
        self.address = make_address(self.customer)
        self.url = reverse('order-update', args=[self.order.id])

    def test_owner_can_attach_their_own_address(self):
        self.client.force_authenticate(self.customer)
        response = self.client.put(self.url, {'address_id': self.address.id}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.order.refresh_from_db()
        self.assertEqual(self.order.address_id, self.address.id)

    def test_another_users_address_is_rejected(self):
        others_address = make_address(self.other_customer)
        self.client.force_authenticate(self.customer)
        response = self.client.put(self.url, {'address_id': others_address.id}, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        self.order.refresh_from_db()
        self.assertIsNone(self.order.address_id)

    def test_unauthenticated_request_is_rejected(self):
        response = self.client.put(self.url, {'address_id': self.address.id}, format='json')
        self.assertIn(response.status_code, (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN))
