from django.contrib import admin
from .models import DoctorProfile


@admin.register(DoctorProfile)
class DoctorProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'specialization', 'qualification', 'experience_years', 'is_available']
    list_filter = ['specialization', 'is_available', 'experience_years']
    search_fields = ['user__username', 'user__first_name', 'user__last_name', 'specialization']