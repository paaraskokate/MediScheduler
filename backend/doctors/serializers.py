from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import DoctorProfile, SPECIALIZATION_CHOICES

User = get_user_model()


class DoctorProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    specialization = serializers.ChoiceField(choices=SPECIALIZATION_CHOICES)

    class Meta:
        model = DoctorProfile
        fields = [
            'id', 'user_id', 'username', 'first_name', 'last_name', 'email',
            'specialization', 'qualification', 'experience_years', 'bio',
            'consultation_fee', 'is_available', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user_id', 'created_at', 'updated_at']


class DoctorListSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    specialization_display = serializers.CharField(source='get_specialization_display', read_only=True)

    class Meta:
        model = DoctorProfile
        fields = ['id', 'name', 'specialization', 'specialization_display', 'qualification', 'experience_years']

    def get_name(self, obj):
        return f"Dr. {obj.user.get_full_name()}"