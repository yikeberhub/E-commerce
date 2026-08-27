from decimal import Decimal

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from users.models import CustomUser
from vendors.models import Vendor
from .models import Product


def make_vendor(email, is_active):
    user = CustomUser.objects.create_user(
        username=email.split('@')[0], email=email, password='pass12345', role='vendor',
    )
    return Vendor.objects.create(user=user, title=f'Vendor {email}', email=f'shop-{email}', is_active=is_active)


class PublicProductVisibilityTests(APITestCase):
    """Vendor.is_active wasn't enforced anywhere before Phase 3 — an
    unapproved/deactivated vendor's products were fully visible on the
    public storefront. These pin down that the two genuinely public
    discovery endpoints now respect it."""

    def setUp(self):
        self.active_vendor = make_vendor('active@test.com', is_active=True)
        self.inactive_vendor = make_vendor('inactive@test.com', is_active=False)

        self.visible_product = Product.objects.create(
            vendor=self.active_vendor, title='Visible Product',
            price=Decimal('10.00'), old_price=Decimal('20.00'), featured=True,
        )
        self.hidden_product = Product.objects.create(
            vendor=self.inactive_vendor, title='Hidden Product',
            price=Decimal('10.00'), old_price=Decimal('20.00'), featured=True,
        )
        self.vendorless_product = Product.objects.create(
            vendor=None, title='Vendorless Product',
            price=Decimal('10.00'), old_price=Decimal('20.00'), featured=True,
        )

    def test_product_list_excludes_inactive_vendor(self):
        response = self.client.get(reverse('product-list'))
        ids = {p['id'] for p in response.data}
        self.assertIn(self.visible_product.id, ids)
        self.assertIn(self.vendorless_product.id, ids)
        self.assertNotIn(self.hidden_product.id, ids)

    def test_featured_products_excludes_inactive_vendor(self):
        response = self.client.get(reverse('featured-products'))
        ids = {p['id'] for p in response.data}
        self.assertIn(self.visible_product.id, ids)
        self.assertIn(self.vendorless_product.id, ids)
        self.assertNotIn(self.hidden_product.id, ids)
