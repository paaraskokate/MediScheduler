import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Typography, Box, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../context/AuthContext';
import { appointmentService, scheduleService } from '../services/api';

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [postponeDialog, setPostponeDialog] = useState({ open: false, appointmentId: null, notes: '' });

  useEffect(() => {
    fetchAppointments();
    fetchSchedules();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentService.getAppointments();
      setAppointments(response.results || response);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchSchedules = async () => {
    try {
      const response = await scheduleService.getSchedules();
      setSchedules(response.results || response);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const handlePostpone = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await appointmentService.postponeAppointment(postponeDialog.appointmentId, postponeDialog.notes);
      setMessage({ type: 'success', text: 'Appointment postponed to later!' });
      setPostponeDialog({ open: false, appointmentId: null, notes: '' });
      fetchAppointments();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to postpone appointment' });
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

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Doctor Dashboard</h1>
          <p>Welcome, Dr. {user?.first_name} {user?.last_name}</p>
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
        <h2 className="form-title">Patient Appointments</h2>

        {appointments.length === 0 ? (
          <div className="empty-state">
            <h3>No Appointments</h3>
            <p>You don't have any appointments yet.</p>
          </div>
        ) : (
          <div className="card-grid">
            {appointments.map((appointment) => (
              <Card key={appointment.id} className="appointment-card">
                <Box sx={{ position: 'relative' }}>
                  {appointment.status === 'pending' && (
                    <IconButton
                      size="small"
                      onClick={() => setPostponeDialog({ 
                        open: true, 
                        appointmentId: appointment.id, 
                        notes: '' 
                      })}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: '#dc2626',
                        color: 'white',
                        width: 28,
                        height: 28,
                        '&:hover': {
                          backgroundColor: '#b91c1c',
                        },
                      }}
                      title="Postpone Appointment"
                    >
                      <CloseIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  )}
                </Box>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {appointment.patient_name}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {appointment.doctor_name} - {appointment.doctor_specialization}
                  </Typography>
                  <Box mt={2} sx={{ 
                    backgroundColor: '#f8fafc', 
                    p: 1.5, 
                    borderRadius: 1,
                    borderLeft: '3px solid #667eea'
                  }}>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Patient Description:</strong>
                    </Typography>
                    <Typography variant="body2">
                      {appointment.symptoms || 'No symptoms described'}
                    </Typography>
                  </Box>
                  <Box mt={2}>
                    <Typography>
                      <strong>Date:</strong> {appointment.appointment_date}
                    </Typography>
                    <Typography>
                      <strong>Time:</strong> {appointment.appointment_time}
                    </Typography>
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

      <div className="form-container">
        <h2 className="form-title">Schedule Board</h2>

        {schedules.length === 0 ? (
          <div className="empty-state">
            <h3>No Schedules</h3>
            <p>No schedule entries available.</p>
          </div>
        ) : (
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Doctor Name</th>
                <th>Room Number</th>
                <th>Date</th>
                <th>Time Slot</th>
              </tr>
            </thead>
            <tbody>
              {schedules.slice(0, 10).map((schedule) => (
                <tr key={schedule.id}>
                  <td>{schedule.doctor_name}</td>
                  <td>{schedule.room_number}</td>
                  <td>{schedule.date}</td>
                  <td>{schedule.time_slot}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Dialog open={postponeDialog.open} onClose={() => setPostponeDialog({ open: false, appointmentId: null, notes: '' })}>
        <DialogTitle>Postpone Appointment</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Reason for Postponement"
            multiline
            rows={3}
            value={postponeDialog.notes}
            onChange={(e) => setPostponeDialog({ ...postponeDialog, notes: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPostponeDialog({ open: false, appointmentId: null, notes: '' })}>Cancel</Button>
          <Button onClick={handlePostpone} variant="contained" color="error" disabled={loading}>
            Postpone
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DoctorDashboard;