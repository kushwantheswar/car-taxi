from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, DriverProfileViewSet, CarViewSet, BookingViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'drivers', DriverProfileViewSet, basename='driver')
router.register(r'cars', CarViewSet, basename='car')
router.register(r'bookings', BookingViewSet, basename='booking')

urlpatterns = [
    path('', include(router.urls)),
]
