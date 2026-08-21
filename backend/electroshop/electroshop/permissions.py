from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdmin(BasePermission):
    """Allows access only to authenticated users with role='admin'."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == "admin"
        )


class IsVendor(BasePermission):
    """Allows access only to authenticated users with role='vendor'."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == "vendor"
        )


class IsAdminOrReadOnly(BasePermission):
    """Anyone can read; only admins can write."""

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == "admin"
        )


class IsOwnerOrAdmin(BasePermission):
    """
    Object-level permission: grants access if the requester is an admin,
    directly owns the object (`obj.user == request.user`), or owns the
    vendor the object belongs to (`obj.vendor.user == request.user`).

    Works for Order (has `user` and `vendor`), Product (has `vendor`),
    ProductReview (has `user`), and Vendor (obj itself has `user`).
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        user = request.user
        if not (user and user.is_authenticated):
            return False
        if user.role == "admin":
            return True

        owner = getattr(obj, "user", None)
        if owner is not None and owner == user:
            return True

        vendor = getattr(obj, "vendor", None)
        if vendor is not None and getattr(vendor, "user", None) == user:
            return True

        return False


class IsOwnerOrAdminOrReadOnly(IsOwnerOrAdmin):
    """Same as IsOwnerOrAdmin, but read access (GET/HEAD/OPTIONS) is open to anyone."""

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return super().has_permission(request, view)

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return super().has_object_permission(request, view, obj)
