from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth import get_user_model
from .models import DoctorProfile
from .serializers import DoctorProfileSerializer, DoctorListSerializer

User = get_user_model()


class DoctorProfileViewSet(viewsets.ModelViewSet):
    queryset = DoctorProfile.objects.select_related('user').all()
    serializer_class = DoctorProfileSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['specialization']
    search_fields = ['user__first_name', 'user__last_name', 'specialization']
    ordering_fields = ['experience_years', 'created_at']

    def get_permissions(self):
        if self.action == 'list':
            return [AllowAny()]
        return super().get_permissions()

    def get_serializer_class(self):
        if self.action == 'list':
            return DoctorListSerializer
        return DoctorProfileSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        specialization = self.request.query_params.get('specialization')
        if specialization:
            queryset = queryset.filter(specialization=specialization)
        return queryset


class DoctorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DoctorProfile.objects.select_related('user').filter(is_available=True)
    serializer_class = DoctorListSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    filterset_fields = ['specialization']
    search_fields = ['user__first_name', 'user__last_name']

    def get_queryset(self):
        queryset = super().get_queryset()
        specialization = self.request.query_params.get('specialization')
        if specialization:
            queryset = queryset.filter(specialization=specialization)
        return queryset