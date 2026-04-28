from django.contrib import admin
from .models import Schedule


@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = ['doctor', 'room_number', 'date', 'time_slot', 'is_available']
    list_filter = ['date', 'is_available', 'doctor__specialization']
    search_fields = ['doctor__user__first_name', 'doctor__user__last_name', 'room_number']
    date_hierarchy = 'date'