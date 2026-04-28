from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DoctorProfileViewSet, DoctorViewSet

router = DefaultRouter()
router.register(r'profiles', DoctorProfileViewSet, basename='doctor-profiles')
router.register(r'', DoctorViewSet, basename='doctors')

urlpatterns = [
    path('', include(router.urls)),
]