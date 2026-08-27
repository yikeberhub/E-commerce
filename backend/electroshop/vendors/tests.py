from datetime import timedelta
from decimal import Decimal

from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from users.models import CustomUser
from .models import Vendor, VendorPayment
from .utils import sync_subscription_status


def make_vendor(email='vendor@test.com', is_active=True):
    user = CustomUser.objects.create_user(
        username=email.split('@')[0], email=email, password='pass12345', role='vendor',
    )
    vendor = Vendor.objects.create(user=user, title='Test Vendor', email=f'shop-{email}', is_active=is_active)
    return user, vendor


def make_admin(email='admin@test.com'):
    return CustomUser.objects.create_user(
        username=email.split('@')[0], email=email, password='pass12345', role='admin',
    )


class SyncSubscriptionStatusTests(APITestCase):
    def test_vendor_with_no_billing_history_is_untouched(self):
        _, vendor = make_vendor(is_active=True)
        sync_subscription_status(vendor)
        vendor.refresh_from_db()
        self.assertTrue(vendor.is_active)

    def test_lapsed_subscription_deactivates(self):
        _, vendor = make_vendor(is_active=True)
        VendorPayment.objects.create(
            vendor=vendor, status='completed',
            subscription_start_date=timezone.now() - timedelta(days=60),
            subscription_end_date=timezone.now() - timedelta(days=30),
        )
        sync_subscription_status(vendor)
        vendor.refresh_from_db()
        self.assertFalse(vendor.is_active)

    def test_fresh_subscription_reactivates(self):
        _, vendor = make_vendor(is_active=False)
        VendorPayment.objects.create(
            vendor=vendor, status='completed',
            subscription_start_date=timezone.now(),
            subscription_end_date=timezone.now() + timedelta(days=30),
        )
        sync_subscription_status(vendor)
        vendor.refresh_from_db()
        self.assertTrue(vendor.is_active)


class VendorSubscriptionEndpointTests(APITestCase):
    def setUp(self):
        self.admin = make_admin()
        self.vendor_user, self.vendor = make_vendor()
        self.url = reverse('vendor-subscription', args=[self.vendor.id])

    def test_vendor_cannot_record_own_subscription(self):
        self.client.force_authenticate(self.vendor_user)
        response = self.client.post(self.url, {
            'subscription_fee': '9.99', 'payment_method': 'bank_transfer',
            'subscription_end_date': (timezone.now() + timedelta(days=30)).isoformat(),
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_record_and_it_reactivates_vendor(self):
        self.vendor.is_active = False
        self.vendor.save(update_fields=['is_active'])

        self.client.force_authenticate(self.admin)
        response = self.client.post(self.url, {
            'subscription_fee': '9.99', 'payment_method': 'bank_transfer',
            'subscription_end_date': (timezone.now() + timedelta(days=30)).isoformat(),
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.vendor.refresh_from_db()
        self.assertTrue(self.vendor.is_active)
        self.assertEqual(VendorPayment.objects.filter(vendor=self.vendor).count(), 1)
