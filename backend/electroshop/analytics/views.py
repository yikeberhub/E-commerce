from datetime import timedelta

from django.utils import timezone
from django.db.models import Sum, Count
from django.db.models.functions import TruncDate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from electroshop.permissions import IsAdmin
from orders.models import Order
from products.models import Product
from users.models import CustomUser

NON_REVENUE_STATUSES = ['pending', 'payment_processing', 'payment_failed', 'canceled']


class AdminAnalyticsOverviewView(APIView):
    """Platform-wide analytics for the admin Analytics page: revenue trend,
    user growth, role/category breakdowns, and a vendor revenue leaderboard,
    all scoped to a `days` query param (default 30)."""

    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        try:
            days = int(request.query_params.get('days', 30))
        except (TypeError, ValueError):
            days = 30
        days = max(1, min(days, 365))
        since = timezone.now() - timedelta(days=days)

        revenue_trend = (
            Order.objects.filter(created_at__gte=since)
            .annotate(date=TruncDate('created_at'))
            .values('date')
            .annotate(total=Sum('total_price'), orders=Count('id'))
            .order_by('date')
        )

        user_growth = (
            CustomUser.objects.filter(created_at__gte=since)
            .annotate(date=TruncDate('created_at'))
            .values('date')
            .annotate(count=Count('id'))
            .order_by('date')
        )

        role_breakdown = CustomUser.objects.values('role').annotate(count=Count('id')).order_by('-count')

        category_breakdown = (
            Product.objects.values('category__title')
            .annotate(count=Count('id'))
            .order_by('-count')[:8]
        )

        vendor_leaderboard = (
            Order.objects.exclude(status__in=NON_REVENUE_STATUSES)
            .filter(vendor__isnull=False)
            .values('vendor__id', 'vendor__title')
            .annotate(revenue=Sum('total_price'), orders=Count('id'))
            .order_by('-revenue')[:10]
        )

        return Response({
            'range_days': days,
            'revenue_trend': [
                {'date': str(r['date']), 'total': float(r['total'] or 0), 'orders': r['orders']}
                for r in revenue_trend
            ],
            'user_growth': [
                {'date': str(r['date']), 'count': r['count']} for r in user_growth
            ],
            'role_breakdown': [
                {'role': r['role'], 'count': r['count']} for r in role_breakdown
            ],
            'category_breakdown': [
                {'category': r['category__title'] or 'Uncategorized', 'count': r['count']}
                for r in category_breakdown
            ],
            'vendor_leaderboard': [
                {
                    'id': r['vendor__id'],
                    'title': r['vendor__title'],
                    'revenue': float(r['revenue'] or 0),
                    'orders': r['orders'],
                }
                for r in vendor_leaderboard
            ],
        })
