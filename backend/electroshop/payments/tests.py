from decimal import Decimal
from unittest.mock import patch

from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from users.models import CustomUser
from vendors.models import Vendor
from orders.models import Order
from .models import Payment, PaymentSession, WithdrawalRequest
from .services import finalize_payment_session


def make_customer(email='customer@test.com', balance='0.00'):
    return CustomUser.objects.create_user(
        username=email.split('@')[0], email=email, password='pass12345',
        role='customer', balance=Decimal(balance),
    )


def make_vendor_user(email='vendor@test.com', balance='0.00'):
    user = CustomUser.objects.create_user(
        username=email.split('@')[0], email=email, password='pass12345', role='vendor',
    )
    vendor = Vendor.objects.create(user=user, title='Test Vendor', email=f'shop-{email}', balance=Decimal(balance))
    return user, vendor


def make_admin(email='admin@test.com'):
    return CustomUser.objects.create_user(
        username=email.split('@')[0], email=email, password='pass12345', role='admin',
    )


class FinalizePaymentSessionTests(APITestCase):
    def setUp(self):
        self.customer = make_customer(balance='1000.00')
        self.vendor_user, self.vendor = make_vendor_user(balance='500.00')
        self.order = Order.objects.create(user=self.customer, vendor=self.vendor, total_price=Decimal('200.00'))
        self.payment = Payment.objects.create(
            order=self.order, amount=Decimal('200.00'), payment_status='pending', transaction_id='tx-1',
        )
        self.session = PaymentSession.objects.create(tx_ref='session-1', user=self.customer, amount=Decimal('200.00'))
        self.session.payments.set([self.payment])

    def test_success_credits_vendor_and_debits_user_once(self):
        touched = finalize_payment_session(self.session, {'data': {'status': 'success'}})
        self.assertEqual(len(touched), 1)

        self.payment.refresh_from_db()
        self.order.refresh_from_db()
        self.vendor.refresh_from_db()
        self.customer.refresh_from_db()

        self.assertEqual(self.payment.payment_status, 'completed')
        self.assertEqual(self.order.status, 'completed')
        self.assertEqual(self.vendor.balance, Decimal('700.00'))
        self.assertEqual(self.customer.balance, Decimal('800.00'))

    def test_calling_twice_is_idempotent(self):
        finalize_payment_session(self.session, {'data': {'status': 'success'}})
        touched_second = finalize_payment_session(self.session, {'data': {'status': 'success'}})

        self.vendor.refresh_from_db()
        self.customer.refresh_from_db()

        self.assertEqual(touched_second, [])
        self.assertEqual(self.vendor.balance, Decimal('700.00'))
        self.assertEqual(self.customer.balance, Decimal('800.00'))

    def test_failure_marks_failed_without_balance_changes(self):
        finalize_payment_session(self.session, {'data': {'status': 'failed'}})

        self.payment.refresh_from_db()
        self.vendor.refresh_from_db()
        self.customer.refresh_from_db()

        self.assertEqual(self.payment.payment_status, 'failed')
        self.assertEqual(self.vendor.balance, Decimal('500.00'))
        self.assertEqual(self.customer.balance, Decimal('1000.00'))

    def test_envelope_success_but_data_not_success_is_treated_as_failure(self):
        # Regression guard: verification['status'] (the envelope, i.e. "we
        # found this transaction") must never be mistaken for the actual
        # payment outcome, which lives under verification['data']['status'].
        finalize_payment_session(self.session, {'status': 'success', 'data': {'status': 'pending'}})
        self.payment.refresh_from_db()
        self.assertEqual(self.payment.payment_status, 'failed')


class CreatePaymentViewTests(APITestCase):
    def setUp(self):
        self.customer = make_customer()
        self.vendor_user, self.vendor = make_vendor_user()
        self.order = Order.objects.create(user=self.customer, vendor=self.vendor, total_price=Decimal('150.00'))
        self.payment = Payment.objects.create(
            order=self.order, amount=Decimal('150.00'), payment_status='pending', transaction_id='tx-42',
        )
        self.url = reverse('create-payment')

    def test_missing_required_fields_returns_400(self):
        self.client.force_authenticate(self.customer)
        response = self.client.post(self.url, {'total_amount': 150}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('payments.views.chapa')
    def test_success_creates_linked_payment_session(self, mock_chapa):
        mock_chapa.initialize.return_value = {
            'status': 'success',
            'data': {'checkout_url': 'https://example.test/checkout'},
        }
        self.client.force_authenticate(self.customer)
        response = self.client.post(self.url, {
            'total_amount': 150,
            'email': self.customer.email,
            'first_name': 'Test',
            'transaction_ids': ['tx-42'],
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        payment_ref = response.data['data']['payment_ref']
        session = PaymentSession.objects.get(tx_ref=payment_ref)
        self.assertEqual(list(session.payments.values_list('transaction_id', flat=True)), ['tx-42'])
        mock_chapa.initialize.assert_called_once()
        self.assertIn('callback_url', mock_chapa.initialize.call_args.kwargs)


class ChapaCallbackTests(APITestCase):
    def setUp(self):
        self.customer = make_customer(balance='1000.00')
        self.vendor_user, self.vendor = make_vendor_user(balance='0.00')
        self.order = Order.objects.create(user=self.customer, vendor=self.vendor, total_price=Decimal('100.00'))
        self.payment = Payment.objects.create(
            order=self.order, amount=Decimal('100.00'), payment_status='pending', transaction_id='tx-99',
        )
        self.session = PaymentSession.objects.create(tx_ref='webhook-tx', user=self.customer, amount=Decimal('100.00'))
        self.session.payments.set([self.payment])

    def test_unknown_tx_ref_is_a_no_op_200(self):
        url = reverse('chapa-webhook', args=['does-not-exist'])
        response = self.client.post(url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @patch('payments.views.verify_payment')
    def test_known_tx_ref_finalizes_via_server_side_reverify(self, mock_verify):
        mock_verify.return_value = {'data': {'status': 'success'}}
        url = reverse('chapa-webhook', args=['webhook-tx'])
        response = self.client.post(url, {'status': 'this body is never trusted'}, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        mock_verify.assert_called_once_with('webhook-tx')
        self.payment.refresh_from_db()
        self.assertEqual(self.payment.payment_status, 'completed')


class WithdrawalRequestTests(APITestCase):
    def setUp(self):
        self.admin = make_admin()
        self.vendor_user, self.vendor = make_vendor_user(balance='1000.00')
        self.other_vendor_user, self.other_vendor = make_vendor_user(email='other@test.com', balance='50.00')
        self.list_url = reverse('withdrawal-list')

    def test_request_reserves_balance(self):
        self.client.force_authenticate(self.vendor_user)
        response = self.client.post(self.list_url, {
            'amount': '300.00', 'payout_method': 'telebirr', 'account_details': '0911111111',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.vendor.refresh_from_db()
        self.assertEqual(self.vendor.balance, Decimal('700.00'))

    def test_request_over_balance_is_rejected(self):
        self.client.force_authenticate(self.other_vendor_user)
        response = self.client.post(self.list_url, {
            'amount': '999999.00', 'payout_method': 'cbe', 'account_details': '123',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.other_vendor.refresh_from_db()
        self.assertEqual(self.other_vendor.balance, Decimal('50.00'))

    def test_reject_refunds_balance(self):
        withdrawal = WithdrawalRequest.objects.create(
            vendor=self.vendor, amount=Decimal('300.00'), account_details='0911111111',
        )
        self.vendor.balance = Decimal('700.00')
        self.vendor.save(update_fields=['balance'])

        self.client.force_authenticate(self.admin)
        url = reverse('withdrawal-detail', args=[withdrawal.id])
        response = self.client.patch(url, {'status': 'rejected', 'admin_note': 'bad details'}, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.vendor.refresh_from_db()
        self.assertEqual(self.vendor.balance, Decimal('1000.00'))

    def test_paid_leaves_balance_deducted(self):
        withdrawal = WithdrawalRequest.objects.create(
            vendor=self.vendor, amount=Decimal('300.00'), account_details='0911111111',
        )
        self.vendor.balance = Decimal('700.00')
        self.vendor.save(update_fields=['balance'])

        self.client.force_authenticate(self.admin)
        url = reverse('withdrawal-detail', args=[withdrawal.id])
        response = self.client.patch(url, {'status': 'paid'}, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.vendor.refresh_from_db()
        self.assertEqual(self.vendor.balance, Decimal('700.00'))

    def test_already_reviewed_request_rejects_second_review(self):
        withdrawal = WithdrawalRequest.objects.create(
            vendor=self.vendor, amount=Decimal('100.00'), account_details='x', status='paid',
        )
        self.client.force_authenticate(self.admin)
        url = reverse('withdrawal-detail', args=[withdrawal.id])
        response = self.client.patch(url, {'status': 'rejected'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
