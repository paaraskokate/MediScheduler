from rest_framework import viewsets, status, filters
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.db.models import Q
from .models import Appointment
from schedules.models import Schedule
from doctors.models import DoctorProfile
from .serializers import (
    AppointmentSerializer,
    AppointmentCreateSerializer,
    AppointmentUpdateSerializer,
    PatientAppointmentSerializer,
    AvailableTimeSlotsSerializer
)
from doctors.serializers import DoctorListSerializer
import traceback
import logging

logger = logging.getLogger(__name__)
User = get_user_model()


@api_view(['GET'])
@permission_classes([AllowAny])
def available_time_slots(request):
    doctor_id = request.query_params.get('doctor_id')
    date = request.query_params.get('date')
    
    if not doctor_id or not date:
        return Response({'error': 'doctor_id and date are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        doctor = DoctorProfile.objects.get(id=doctor_id)
    except DoctorProfile.DoesNotExist:
        return Response({'error': 'Doctor not found'}, status=status.HTTP_404_NOT_FOUND)
    
    schedules = Schedule.objects.filter(
        doctor=doctor,
        date=date,
        is_available=True
    ).order_by('time_slot')
    
    existing_appointments = Appointment.objects.filter(
        doctor=doctor,
        appointment_date=date,
        status__in=['pending', 'accepted']
    ).values_list('appointment_time', flat=True)
    
    available_slots = []
    for schedule in schedules:
        if schedule.time_slot not in existing_appointments:
            available_slots.append({
                'time_slot': str(schedule.time_slot),
                'room_number': schedule.room_number,
                'is_available': True
            })
    
    return Response(available_slots)


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.select_related('doctor__user', 'patient').all()
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'doctor__specialization']
    ordering_fields = ['appointment_date', 'appointment_time', 'created_at']

    def get_serializer_class(self):
        if self.action == 'create':
            return AppointmentCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return AppointmentUpdateSerializer
        elif self.action == 'list':
            user = self.request.user
            if user.role == 'patient':
                return PatientAppointmentSerializer
            return AppointmentSerializer
        return AppointmentSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            return Appointment.objects.select_related('doctor__user', 'patient').filter(patient=user)
        elif user.role == 'doctor':
            return Appointment.objects.select_related('doctor__user', 'patient').filter(doctor__user=user)
        return super().get_queryset()

    def create(self, request, *args, **kwargs):
        try:
            print("Creating appointment...")
            print("Request data:", request.data)
            print("User:", request.user)
            
            serializer = self.get_serializer(data=request.data, context={'request': request})
            print("Is valid:", serializer.is_valid())
            
            if not serializer.is_valid():
                print("Validation errors:", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            appointment = serializer.save()
            print("Appointment created:", appointment.id)
            
            return Response(
                AppointmentSerializer(appointment).data,
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            print(f"Error creating appointment: {type(e).__name__}: {e}")
            traceback.print_exc()
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(AppointmentSerializer(instance).data)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)