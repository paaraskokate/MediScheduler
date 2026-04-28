from rest_framework.routers import DefaultRouter
from .views import AppointmentViewSet, available_time_slots
from django.urls import path

router = DefaultRouter()
router.register(r'', AppointmentViewSet, basename='appointments')

urlpatterns = [
    path('available-slots/', available_time_slots, name='available_time_slots'),
] + router.urls