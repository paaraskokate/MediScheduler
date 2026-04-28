# -*- coding: utf-8 -*-

from django.db import models
from django.contrib.auth import get_user_model
from doctors.models import DoctorProfile

User = get_user_model()


class Schedule(models.Model):
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='schedules')
    room_number = models.CharField(max_length=20)
    date = models.DateField()
    time_slot = models.TimeField()
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'schedules'
        ordering = ['date', 'time_slot']
        unique_together = ['doctor', 'date', 'time_slot']

    def __str__(self):
        return f"Dr. {self.doctor.user.get_full_name()} - Room {self.room_number} - {self.date} {self.time_slot}"