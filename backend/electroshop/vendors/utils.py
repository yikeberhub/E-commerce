from django.utils import timezone


def latest_subscription_payment(vendor):
    return vendor.subscription_payments.filter(
        status='completed', subscription_end_date__isnull=False
    ).order_by('-subscription_end_date').first()


def sync_subscription_status(vendor):
    """Recomputes vendor.is_active from the latest completed subscription
    payment. No-op for a vendor with no billing history at all — this is
    what keeps the rollout safe for every existing vendor. Called lazily
    wherever active status is read, since there's no task scheduler in
    this project to run it on a timer."""
    latest = latest_subscription_payment(vendor)
    if not latest:
        return vendor

    should_be_active = latest.subscription_end_date >= timezone.now()
    if vendor.is_active != should_be_active:
        vendor.is_active = should_be_active
        vendor.save(update_fields=['is_active'])
    return vendor
