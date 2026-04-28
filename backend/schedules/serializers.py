from rest_framework import serializers
from .models import Schedule
from doctors.serializers import DoctorListSerializer


class ScheduleSerializer(serializers.ModelSerializer):
    doctor_name = serializers.SerializerMethodField()
    specialization = serializers.CharField(source='doctor.get_specialization_display', read_only=True)

    class Meta:
        model = Schedule
        fields = [
            'id', 'doctor', 'doctor_name', 'specialization',
            'room_number', 'date', 'time_slot', 'is_available',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_doctor_name(self, obj):
        return f"Dr. {obj.doctor.user.get_full_name()}"


class ScheduleListSerializer(serializers.ModelSerializer):
    doctor_name = serializers.SerializerMethodField()

    class Meta:
        model = Schedule
        fields = ['id', 'doctor_name', 'room_number', 'date', 'time_slot', 'is_available']

    def get_doctor_name(self, obj):
        return f"Dr. {obj.doctor.user.get_full_name()}"