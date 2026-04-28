import os
import sys
import django
from datetime import date, time, timedelta
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medischeduler.settings')
django.setup()

from django.contrib.auth import get_user_model
from doctors.models import DoctorProfile, SPECIALIZATION_CHOICES
from schedules.models import Schedule
from appointments.models import Appointment

User = get_user_model()


def create_admin_user():
    admin_user, created = User.objects.get_or_create(
        username='admin',
        defaults={
            'email': 'admin@medischeduler.com',
            'first_name': 'System',
            'last_name': 'Admin',
            'role': 'admin',
            'is_staff': True,
            'is_superuser': True,
        }
    )
    if created:
        admin_user.set_password('admin123')
        admin_user.save()
        print(f"Created admin user: {admin_user.username}")
    else:
        print(f"Admin user already exists: {admin_user.username}")
    return admin_user


def create_doctors():
    doctors_data = [
        {
            'username': 'dr_smith',
            'email': 'dr.smith@medischeduler.com',
            'first_name': 'John',
            'last_name': 'Smith',
            'role': 'doctor',
            'specialization': 'cardiologist',
            'qualification': 'MD, FACC',
            'experience_years': 15,
            'bio': 'Dr. John Smith is a board-certified cardiologist with over 15 years of experience in treating heart conditions.',
            'consultation_fee': 150.00,
        },
        {
            'username': 'dr_johnson',
            'email': 'dr.johnson@medischeduler.com',
            'first_name': 'Sarah',
            'last_name': 'Johnson',
            'role': 'doctor',
            'specialization': 'dentist',
            'qualification': 'DDS, MD',
            'experience_years': 12,
            'bio': 'Dr. Sarah Johnson is a renowned dentist specializing in preventive and cosmetic dentistry.',
            'consultation_fee': 100.00,
        },
        {
            'username': 'dr_williams',
            'email': 'dr.williams@medischeduler.com',
            'first_name': 'Michael',
            'last_name': 'Williams',
            'role': 'doctor',
            'specialization': 'dermatologist',
            'qualification': 'MD, FAAD',
            'experience_years': 10,
            'bio': 'Dr. Michael Williams specializes in skin conditions, acne treatment, and anti-aging procedures.',
            'consultation_fee': 125.00,
        },
        {
            'username': 'dr_brown',
            'email': 'dr.brown@medischeduler.com',
            'first_name': 'Emily',
            'last_name': 'Brown',
            'role': 'doctor',
            'specialization': 'neurologist',
            'qualification': 'MD, PhD',
            'experience_years': 18,
            'bio': 'Dr. Emily Brown is a neurologist with extensive experience in treating neurological disorders.',
            'consultation_fee': 175.00,
        },
        {
            'username': 'dr_davis',
            'email': 'dr.davis@medischeduler.com',
            'first_name': 'David',
            'last_name': 'Davis',
            'role': 'doctor',
            'specialization': 'cardiologist',
            'qualification': 'MD, FESC',
            'experience_years': 8,
            'bio': 'Dr. David Davis specializes in interventional cardiology and heart failure management.',
            'consultation_fee': 130.00,
        },
    ]

    doctors = []
    for data in doctors_data:
        username = data['username']
        user_data = {
            'email': data['email'],
            'first_name': data['first_name'],
            'last_name': data['last_name'],
            'role': data['role'],
        }
        user, created = User.objects.get_or_create(
            username=username,
            defaults=user_data
        )
        if created:
            user.set_password('doctor123')
            user.save()

        doctor, doc_created = DoctorProfile.objects.get_or_create(
            user=user,
            defaults={
                'specialization': data['specialization'],
                'qualification': data['qualification'],
                'experience_years': data['experience_years'],
                'bio': data['bio'],
                'consultation_fee': data['consultation_fee'],
            }
        )
        doctors.append(doctor)
        if doc_created:
            print(f"Created doctor: Dr. {user.get_full_name()} - {doctor.get_specialization_display()}")
        else:
            print(f"Doctor already exists: Dr. {user.get_full_name()}")

    return doctors


def create_schedules(doctors):
    today = date.today()
    schedule_entries = []

    time_slots = [
        time(9, 0),
        time(10, 0),
        time(11, 0),
        time(14, 0),
        time(15, 0),
        time(16, 0),
    ]

    room_numbers = ['101', '102', '103', '104', '201', '202']

    for doctor in doctors:
        for day_offset in range(7):
            schedule_date = today + timedelta(days=day_offset)
            for slot_index, slot_time in enumerate(time_slots):
                room_num = room_numbers[slot_index % len(room_numbers)]
                schedule, created = Schedule.objects.get_or_create(
                    doctor=doctor,
                    date=schedule_date,
                    time_slot=slot_time,
                    defaults={
                        'room_number': room_num,
                        'is_available': True,
                    }
                )
                if created:
                    schedule_entries.append(schedule)

    print(f"Created {len(schedule_entries)} schedule entries")
    return schedule_entries


def create_patients():
    patients_data = [
        {
            'username': 'patient1',
            'email': 'patient1@example.com',
            'first_name': 'Alice',
            'last_name': 'Anderson',
            'role': 'patient',
        },
        {
            'username': 'patient2',
            'email': 'patient2@example.com',
            'first_name': 'Bob',
            'last_name': 'Wilson',
            'role': 'patient',
        },
    ]

    patients = []
    for data in patients_data:
        user, created = User.objects.get_or_create(
            username=data['username'],
            defaults=data
        )
        if created:
            user.set_password('patient123')
            user.save()
            patients.append(user)
            print(f"Created patient: {user.username}")
        else:
            print(f"Patient already exists: {user.username}")
            patients.append(user)

    return patients


def create_sample_appointments(doctors, patients):
    if not doctors or not patients:
        print("Cannot create appointments without doctors and patients")
        return

    today = date.today()

    appointments_data = [
        {
            'patient': patients[0],
            'doctor': doctors[0],
            'appointment_date': today + timedelta(days=1),
            'appointment_time': time(10, 0),
            'status': 'pending',
            'symptoms': 'Chest pain and shortness of breath',
        },
        {
            'patient': patients[1],
            'doctor': doctors[1],
            'appointment_date': today + timedelta(days=2),
            'appointment_time': time(14, 0),
            'status': 'accepted',
            'symptoms': 'Toothache and sensitivity',
        },
    ]

    for appt_data in appointments_data:
        doctor = appt_data.pop('doctor')
        patient = appt_data.pop('patient')

        appointment, created = Appointment.objects.get_or_create(
            patient=patient,
            doctor=doctor,
            appointment_date=appt_data['appointment_date'],
            appointment_time=appt_data['appointment_time'],
            defaults=appt_data
        )
        if created:
            print(f"Created appointment: Patient {patient.username} with Dr. {doctor.user.username}")


def main():
    print("Starting dummy data creation...")
    print("-" * 50)

    create_admin_user()
    doctors = create_doctors()
    create_schedules(doctors)
    patients = create_patients()
    create_sample_appointments(doctors, patients)

    print("-" * 50)
    print("Dummy data creation completed!")
    print("\nLogin credentials:")
    print("Admin: admin / admin123")
    print("Doctors: dr_smith / doctor123 (and other doctors)")
    print("Patients: patient1 / patient123")


if __name__ == '__main__':
    main()