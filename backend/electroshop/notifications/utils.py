from .models import Notification


def notify(recipient, notification_type, title, message='', link=''):
    """Creates a notification. Failures here should never break the
    action that triggered them (e.g. placing an order), so callers
    should wrap this in a try/except if used inside a critical path."""
    if recipient is None:
        return None
    return Notification.objects.create(
        recipient=recipient,
        notification_type=notification_type,
        title=title,
        message=message,
        link=link,
    )
