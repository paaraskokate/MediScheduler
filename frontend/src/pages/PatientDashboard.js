import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  Chip,
  Grid,
  Paper,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { doctorService, appointmentService } from '../services/api';

const SPECIALIZATIONS = [
  { value: '', label: 'All Specializations' },
  { value: 'cardiologist', label: 'Cardiologist' },
  { value: 'dentist', label: 'Dentist' },
  { value: 'dermatologist', label: 'Dermatologist' },
  { value: 'neurologist', label: 'Neurologist' },
];

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [specialization, setSpecialization] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookingData, setBookingData] = useState({
    appointment_date: '',
    time_slot: '',
    symptoms: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [slotsLoading, setSlotsLoading] = useState(false);

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
  }, [specialization]);

  useEffect(() => {
    if (selectedDoctor && bookingData.appointment_date) {
      fetchAvailableSlots();
    }
  }, [selectedDoctor, bookingData.appointment_date]);

  const fetchDoctors = async () => {
    try {
      const params = specialization ? { specialization } : {};
      const response = await doctorService.getDoctors(params.specialization);
      setDoctors(response.results || response);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await appointmentService.getAppointments();
      setAppointments(response.results || response);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchAvailableSlots = async () => {
    setSlotsLoading(true);
    try {
      const response = await api.get(`/appointments/available-slots/?doctor_id=${selectedDoctor}&date=${bookingData.appointment_date}`);
      setAvailableSlots(response.data);
    } catch (error) {
      console.error('Error fetching slots:', error);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await appointmentService.createAppointment({
        doctor: selectedDoctor,
        appointment_date: bookingData.appointment_date,
        time_slot: bookingData.time_slot,
        symptoms: bookingData.symptoms,
      });
      setMessage({ type: 'success', text: 'Appointment booked successfully!' });
      setBookingData({ appointment_date: '', time_slot: '', symptoms: '' });
      setSelectedDoctor('');
      setAvailableSlots([]);
      fetchAppointments();
    } catch (error) {
      const errData = await error.response?.json();
      setMessage({ type: 'error', text: errData?.time_slot || errData?.detail || 'Failed to book appointment' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    const statusMap = {
      pending: 'status-pending',
      accepted: 'status-accepted',
      postponed: 'status-postponed',
      completed: 'status-completed',
      cancelled: 'status-cancelled',
    };
    return statusMap[status] || '';
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Patient Dashboard</h1>
          <p>Welcome, {user?.first_name} {user?.last_name}</p>
        </div>
        <Button variant="outlined" color="error" onClick={logout}>
          Logout
        </Button>
      </header>

      {message.text && (
        <Alert
          severity={message.type}
          onClose={() => setMessage({ type: '', text: '' })}
          style={{ marginBottom: '16px' }}
        >
          {message.text}
        </Alert>
      )}

      <div className="form-container">
        <h2 className="form-title">Book an Appointment</h2>

        <FormControl fullWidth margin="normal">
          <InputLabel>Select Specialization</InputLabel>
          <Select
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            label="Select Specialization"
          >
            {SPECIALIZATIONS.map((spec) => (
              <MenuItem key={spec.value} value={spec.value}>
                {spec.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Select Doctor</InputLabel>
          <Select
            value={selectedDoctor}
            onChange={(e) => {
              setSelectedDoctor(e.target.value);
              setBookingData({ ...bookingData, appointment_date: '', time_slot: '' });
            }}
            label="Select Doctor"
            disabled={doctors.length === 0}
          >
            {doctors.map((doctor) => (
              <MenuItem key={doctor.id} value={doctor.id}>
                {doctor.name} - {doctor.specialization_display}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <form onSubmit={handleBooking}>
          <TextField
            fullWidth
            label="Appointment Date"
            type="date"
            value={bookingData.appointment_date}
            onChange={(e) => {
              setBookingData({ ...bookingData, appointment_date: e.target.value, time_slot: '' });
            }}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: getMinDate() }}
            required
            disabled={!selectedDoctor}
          />

          {selectedDoctor && bookingData.appointment_date && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Select Time Slot</InputLabel>
              <Select
                value={bookingData.time_slot}
                onChange={(e) => setBookingData({ ...bookingData, time_slot: e.target.value })}
                label="Select Time Slot"
                required
                disabled={slotsLoading}
              >
                {slotsLoading ? (
                  <MenuItem disabled>Loading available slots...</MenuItem>
                ) : availableSlots.length === 0 ? (
                  <MenuItem disabled>No slots available for this date</MenuItem>
                ) : (
                  availableSlots.map((slot, index) => (
                    <MenuItem key={index} value={slot.time_slot}>
                      {slot.time_slot} - Room {slot.room_number}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          )}

          <TextField
            fullWidth
            label="Symptoms / Reason for Visit"
            multiline
            rows={3}
            value={bookingData.symptoms}
            onChange={(e) => setBookingData({ ...bookingData, symptoms: e.target.value })}
            margin="normal"
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading || !selectedDoctor || !bookingData.time_slot}
            style={{ marginTop: '16px', backgroundColor: '#667eea' }}
          >
            {loading ? 'Booking...' : 'Book Appointment'}
          </Button>
        </form>
      </div>

      <div className="form-container">
        <h2 className="form-title">My Appointments</h2>

        {appointments.length === 0 ? (
          <div className="empty-state">
            <h3>No Appointments</h3>
            <p>You haven't booked any appointments yet.</p>
          </div>
        ) : (
          <div className="card-grid">
            {appointments.map((appointment) => (
              <Card key={appointment.id} className="appointment-card">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {appointment.doctor_name}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {appointment.doctor_specialization}
                  </Typography>
                  <Box mt={2}>
                    <Typography>
                      <strong>Date:</strong> {appointment.appointment_date}
                    </Typography>
                    <Typography>
                      <strong>Time:</strong> {appointment.appointment_time}
                    </Typography>
                    {appointment.room_number && appointment.status === 'accepted' && (
                      <Typography>
                        <strong>Room:</strong> {appointment.room_number}
                      </Typography>
                    )}
                    {appointment.symptoms && (
                      <Typography>
                        <strong>Symptoms:</strong> {appointment.symptoms}
                      </Typography>
                    )}
                  </Box>
                  <Box mt={2}>
                    <span className={`status-badge ${getStatusClass(appointment.status)}`}>
                      {appointment.status_display || appointment.status}
                    </span>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;