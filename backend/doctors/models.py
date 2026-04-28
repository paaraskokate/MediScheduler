# -*- coding: utf-8 -*-

from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


SPECIALIZATION_CHOICES = [
    ('cardiologist', 'Cardiologist'),
    ('dentist', 'Dentist'),
    ('dermatologist', 'Dermatologist'),
    ('neurologist', 'Neurologist'),
]


class DoctorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor_profile')
    specialization = models.CharField(max_length=50, choices=SPECIALIZATION_CHOICES)
    qualification = models.CharField(max_length=200, blank=True, null=True)
    experience_years = models.IntegerField(default=0)
    bio = models.TextField(blank=True, null=True)
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'doctor_profiles'

    def __str__(self):
        return f"Dr. {self.user.get_full_name()} - {self.get_specialization_display()}"