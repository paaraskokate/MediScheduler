from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Appointment
from doctors.serializers import DoctorListSerializer
from schedules.models import Schedule
import logging

logger = logging.getLogger(__name__)
User = get_user_model()


class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.get_full_name', read_only=True)
    doctor_name = serializers.SerializerMethodField()
    doctor_specialization = serializers.CharField(source='doctor.get_specialization_display', read_only=True)
    room_number = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = [
            'id', 'patient', 'patient_name', 'doctor', 'doctor_name', 'doctor_specialization',
            'appointment_date', 'appointment_time', 'status', 'symptoms', 'notes',
            'room_number', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'status', 'created_at', 'updated_at']

    def get_doctor_name(self, obj):
        return f"Dr. {obj.doctor.user.get_full_name()}"

    def get_room_number(self, obj):
        if obj.status == 'accepted':
            try:
                schedule = Schedule.objects.get(
                    doctor=obj.doctor,
                    date=obj.appointment_date,
                    time_slot=obj.appointment_time
                )
                return schedule.room_number
            except Schedule.DoesNotExist:
                return None
        return None


class AvailableTimeSlotsSerializer(serializers.Serializer):
    time_slot = serializers.TimeField()
    room_number = serializers.CharField()
    is_available = serializers.BooleanField()


class AppointmentCreateSerializer(serializers.Serializer):
    doctor = serializers.IntegerField()
    appointment_date = serializers.DateField()
    time_slot = serializers.CharField()
    symptoms = serializers.CharField(required=False, allow_blank=True)

    def create(self, validated_data):
        from doctors.models import DoctorProfile
        from django.utils import timezone
        
        doctor_id = validated_data['doctor']
        date = validated_data['appointment_date']
        time_str = validated_data['time_slot']
        symptoms = validated_data.get('symptoms', '')
        
        # Get doctor
        try:
            doctor = DoctorProfile.objects.get(id=doctor_id)
        except DoctorProfile.DoesNotExist:
            raise serializers.ValidationError({'doctor': 'Invalid doctor ID'})
        
        # Parse time
        from datetime import datetime, time
        try:
            time_obj = datetime.strptime(time_str, '%H:%M:%S').time()
        except:
            try:
                time_obj = datetime.strptime(time_str, '%H:%M').time()
            except:
                raise serializers.ValidationError({'time_slot': 'Invalid time format'})
        
        # Check schedule availability
        try:
            schedule = Schedule.objects.get(
                doctor=doctor,
                date=date,
                time_slot=time_obj,
                is_available=True
            )
        except Schedule.DoesNotExist:
            raise serializers.ValidationError({'time_slot': 'This time slot is no longer available'})
        
        # Get patient from request
        patient = self.context['request'].user
        
        # Create appointment
        appointment = Appointment.objects.create(
            patient=patient,
            doctor=doctor,
            appointment_date=date,
            appointment_time=time_obj,
            symptoms=symptoms,
            status='pending'
        )
        
        # Mark schedule as unavailable
        schedule.is_available = False
        schedule.save()
        
        return appointment


class AppointmentUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['status', 'appointment_date', 'appointment_time', 'notes']

    def update(self, instance, validated_data):
        if 'status' in validated_data:
            new_status = validated_data['status']
            if new_status == 'postponed' and instance.status == 'pending':
                schedule = Schedule.objects.filter(
                    doctor=instance.doctor,
                    date=instance.appointment_date,
                    time_slot=instance.appointment_time
                ).first()
                if schedule:
                    schedule.is_available = True
                    schedule.save()
            instance.status = new_status
        if 'appointment_date' in validated_data:
            instance.appointment_date = validated_data['appointment_date']
        if 'appointment_time' in validated_data:
            instance.appointment_time = validated_data['appointment_time']
        if 'notes' in validated_data:
            instance.notes = validated_data['notes']
        instance.save()
        return instance


class PatientAppointmentSerializer(serializers.ModelSerializer):
    doctor_name = serializers.SerializerMethodField()
    doctor_specialization = serializers.CharField(source='doctor.get_specialization_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    room_number = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = [
            'id', 'doctor', 'doctor_name', 'doctor_specialization',
            'appointment_date', 'appointment_time', 'status', 'status_display',
            'symptoms', 'notes', 'room_number', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_doctor_name(self, obj):
        return f"Dr. {obj.doctor.user.get_full_name()}"

    def get_room_number(self, obj):
        if obj.status == 'accepted':
            try:
                schedule = Schedule.objects.get(
                    doctor=obj.doctor,
                    date=obj.appointment_date,
                    time_slot=obj.appointment_time
                )
                return schedule.room_number
            except Schedule.DoesNotExist:
                return None
        return None