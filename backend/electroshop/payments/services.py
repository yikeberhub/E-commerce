from .models import PaymentSession


def finalize_payment_session(session: PaymentSession, verification: dict) -> list:
    """Idempotently applies a Chapa verify result to every Payment in
    `session`. Safe to call twice — from both the webhook and the polling
    endpoint landing on the same session — since a Payment that's already
    left 'pending' is skipped, so vendor/user balances are never applied
    twice.

    `verification` is the raw response from Chapa's verify API. Its
    top-level `status` only reflects whether the verify call itself
    succeeded (i.e. "we found this transaction"); the actual payment
    outcome is nested under `data.status`.
    """
    payment_succeeded = bool(
        verification and verification.get('data', {}).get('status') == 'success'
    )

    touched = []
    for payment in session.payments.select_related('order', 'order__vendor', 'order__user').all():
        if payment.payment_status != 'pending':
            continue

        if payment_succeeded:
            payment.payment_status = 'completed'
            payment.save(update_fields=['payment_status', 'updated_at'])

            order = payment.order
            if order:
                order.status = 'completed'
                order.save(update_fields=['status', 'updated_at'])

                vendor = order.vendor
                if vendor:
                    vendor.balance += payment.amount
                    vendor.save(update_fields=['balance'])
        else:
            payment.payment_status = 'failed'
            payment.save(update_fields=['payment_status', 'updated_at'])

        touched.append(payment)

    if payment_succeeded and touched:
        completed_total = sum(p.amount for p in touched)
        user = session.user
        user.balance -= completed_total
        user.save(update_fields=['balance'])

    return touched
