import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, Container, Grid, Typography, TextField, MenuItem } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const services = [
  {
    icon: <LocalHospitalIcon sx={{ fontSize: 40, color: '#667eea' }} />,
    title: 'Expert Doctors',
    description: 'Connect with certified specialists across Cardiology, Neurology, Dermatology, and more.'
  },
  {
    icon: <CalendarMonthIcon sx={{ fontSize: 40, color: '#667eea' }} />,
    title: 'Easy Booking',
    description: 'Book appointments in seconds with real-time availability tracking.'
  },
  {
    icon: <AccessTimeIcon sx={{ fontSize: 40, color: '#667eea' }} />,
    title: 'Flexible Scheduling',
    description: 'Choose from available time slots that fit your schedule.'
  },
  {
    icon: <VerifiedUserIcon sx={{ fontSize: 40, color: '#667eea' }} />,
    title: 'Verified Records',
    description: 'All appointments and medical records securely stored.'
  }
];

const departments = [
  { name: 'Cardiology', icon: '❤️' },
  { name: 'Dentistry', icon: '🦷' },
  { name: 'Dermatology', icon: '🧴' },
  { name: 'Neurology', icon: '🧠' }
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={styles.container}>
      {/* Header */}
      <Box sx={styles.header}>
        <Container maxWidth="lg">
          <Box sx={styles.headerContent}>
            <Typography variant="h5" sx={styles.logo}>
              <LocalHospitalIcon sx={{ mr: 1, fontSize: 32 }} />
              MediScheduler
            </Typography>
            <Box sx={styles.headerButtons}>
              <Button variant="outlined" sx={styles.loginBtn} onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button variant="contained" sx={styles.signupBtn} onClick={() => navigate('/register')}>
                Get Started
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box sx={styles.hero}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" sx={styles.heroTitle}>
                Healthcare Scheduling{' '}
                <Box component="span" sx={styles.heroHighlight}>Simplified</Box>
              </Typography>
              <Typography variant="h6" sx={styles.heroSubtitle}>
                Book appointments with top specialists in just a few clicks. 
                No waiting, no calls - just seamless healthcare access.
              </Typography>
              <Box sx={styles.heroButtons}>
                <Button 
                  variant="contained" 
                  size="large" 
                  sx={styles.heroPrimaryBtn}
                  onClick={() => navigate('/register')}
                >
                  Book Appointment
                  <ArrowForwardIcon sx={{ ml: 1 }} />
                </Button>
                <Button 
                  variant="outlined" 
                  size="large" 
                  sx={styles.heroSecondaryBtn}
                  onClick={() => navigate('/login')}
                >
                  Doctor Login
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={styles.heroImage}>
                <Card sx={styles.heroCard}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Quick Booking
                    </Typography>
                    <TextField
                      fullWidth
                      select
                      label="Select Specialization"
                      defaultValue=""
                      sx={styles.input}
                    >
                      {departments.map((dept) => (
                        <MenuItem key={dept.name} value={dept.name}>
                          {dept.icon} {dept.name}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      fullWidth
                      label="Select Date"
                      type="date"
                      sx={styles.input}
                      InputLabelProps={{ shrink: true }}
                    />
                    <Button fullWidth variant="contained" sx={styles.bookBtn}>
                      Check Availability
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Services Section */}
      <Box sx={styles.services}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={styles.sectionTitle}>
            Why Choose MediScheduler
          </Typography>
          <Typography variant="body1" sx={styles.sectionSubtitle}>
            We make healthcare accessible and hassle-free
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={styles.serviceCard}>
                  <CardContent sx={styles.serviceCardContent}>
                    <Box sx={styles.serviceIcon}>
                      {service.icon}
                    </Box>
                    <Typography variant="h6" sx={styles.serviceTitle}>
                      {service.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {service.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Departments Section */}
      <Box sx={styles.departments}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={styles.sectionTitle}>
            Our Specializations
          </Typography>
          <Typography variant="body1" sx={styles.sectionSubtitle}>
            Find the right specialist for your needs
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {departments.map((dept, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={styles.deptCard}>
                  <CardContent sx={styles.deptCardContent}>
                    <Typography variant="h3" sx={styles.deptIcon}>
                      {dept.icon}
                    </Typography>
                    <Typography variant="h6" sx={styles.deptName}>
                      {dept.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works */}
      <Box sx={styles.howItWorks}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={styles.sectionTitle}>
            How It Works
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Box sx={styles.stepCard}>
                <Box sx={styles.stepNumber}>1</Box>
                <Typography variant="h6">Choose Department</Typography>
                <Typography variant="body2" color="text.secondary">
                  Select the specialization you need from our list of expert departments.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={styles.stepCard}>
                <Box sx={styles.stepNumber}>2</Box>
                <Typography variant="h6">Pick Your Slot</Typography>
                <Typography variant="body2" color="text.secondary">
                  Choose from available time slots based on your preferred date.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={styles.stepCard}>
                <Box sx={styles.stepNumber}>3</Box>
                <Typography variant="h6">Get Confirmed</Typography>
                <Typography variant="body2" color="text.secondary">
                  Receive instant confirmation with your room number and appointment details.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={styles.cta}>
        <Container maxWidth="md">
          <Typography variant="h4" sx={styles.ctaTitle}>
            Ready to Book Your Appointment?
          </Typography>
          <Typography variant="body1" sx={styles.ctaSubtitle}>
            Join thousands of patients who trust MediScheduler for their healthcare needs.
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            sx={styles.ctaBtn}
            onClick={() => navigate('/register')}
          >
            Create Free Account
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={styles.footer}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={styles.footerLogo}>
                <LocalHospitalIcon sx={{ mr: 1 }} />
                MediScheduler
              </Typography>
              <Typography variant="body2" sx={styles.footerText}>
                Your trusted platform for booking healthcare appointments. 
                Simplifying access to quality medical care.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={styles.footerTitle}>
                Quick Links
              </Typography>
              <Box sx={styles.footerLinks}>
                <Link to="/login" style={styles.footerLink}>Login</Link>
                <Link to="/register" style={styles.footerLink}>Register</Link>
                <Link to="/register" style={styles.footerLink}>Book Appointment</Link>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={styles.footerTitle}>
                Contact
              </Typography>
              <Typography variant="body2" sx={styles.footerText}>
                Email: paaraskokate@gmail.com
              </Typography>
              <Typography variant="body2" sx={styles.footerLink}>
                <a href="https://github.com/paaraskokate" target="_blank" rel="noopener noreferrer" style={styles.footerLink}>
                  GitHub: paaraskokate
                </a>
              </Typography>
            </Grid>
          </Grid>
          <Box sx={styles.footerBottom}>
            <Typography variant="body2" sx={styles.footerText} align="center">
              © 2026 MediScheduler. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
  },
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    py: 2,
  },
  logo: {
    fontWeight: 700,
    color: '#667eea',
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
  },
  headerButtons: {
    display: 'flex',
    gap: 2,
  },
  loginBtn: {
    borderColor: '#667eea',
    color: '#667eea',
  },
  signupBtn: {
    backgroundColor: '#667eea',
    '&:hover': { backgroundColor: '#5a6fd6' },
  },
  hero: {
    pt: 12,
    pb: 8,
    background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },
  heroTitle: {
    fontSize: { xs: '2.5rem', md: '3.5rem' },
    fontWeight: 700,
    lineHeight: 1.2,
    mb: 2,
  },
  heroHighlight: {
    color: '#fbbf24',
  },
  heroSubtitle: {
    fontSize: { xs: '1rem', md: '1.25rem' },
    opacity: 0.9,
    mb: 4,
  },
  heroButtons: {
    display: 'flex',
    gap: 2,
    flexWrap: 'wrap',
  },
  heroPrimaryBtn: {
    backgroundColor: '#fbbf24',
    color: '#1f2937',
    px: 4,
    py: 1.5,
    fontSize: '1.1rem',
    '&:hover': { backgroundColor: '#f59e0b' },
  },
  heroSecondaryBtn: {
    borderColor: 'white',
    color: 'white',
    px: 4,
    py: 1.5,
    fontSize: '1.1rem',
    '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
  },
  heroImage: {
    display: { xs: 'none', md: 'block' },
  },
  heroCard: {
    borderRadius: 3,
    boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
    backgroundColor: 'rgba(255,255,255,0.98)',
  },
  input: {
    mb: 2,
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
    },
  },
  bookBtn: {
    backgroundColor: '#667eea',
    py: 1.5,
    '&:hover': { backgroundColor: '#5a6fd6' },
  },
  services: {
    py: 10,
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: 700,
    textAlign: 'center',
    mb: 1,
    color: '#1f2937',
  },
  sectionSubtitle: {
    textAlign: 'center',
    color: '#6b7280',
    mb: 4,
  },
  serviceCard: {
    height: '100%',
    borderRadius: 3,
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
    },
  },
  serviceCardContent: {
    p: 3,
    textAlign: 'center',
  },
  serviceIcon: {
    mb: 2,
  },
  serviceTitle: {
    fontWeight: 600,
    mb: 1,
  },
  departments: {
    py: 10,
    backgroundColor: '#f8fafc',
  },
  deptCard: {
    borderRadius: 3,
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
    },
  },
  deptCardContent: {
    p: 3,
    textAlign: 'center',
  },
  deptIcon: {
    fontSize: '2.5rem',
    mb: 1,
  },
  deptName: {
    fontWeight: 600,
  },
  howItWorks: {
    py: 10,
    backgroundColor: 'white',
  },
  stepCard: {
    textAlign: 'center',
    p: 3,
  },
  stepNumber: {
    width: 50,
    height: 50,
    borderRadius: '50%',
    backgroundColor: '#667eea',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 700,
    margin: '0 auto 2px',
  },
  cta: {
    py: 10,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textAlign: 'center',
    color: 'white',
  },
  ctaTitle: {
    fontWeight: 700,
    mb: 2,
  },
  ctaSubtitle: {
    mb: 4,
    opacity: 0.9,
  },
  ctaBtn: {
    backgroundColor: '#fbbf24',
    color: '#1f2937',
    px: 4,
    py: 1.5,
    fontSize: '1.1rem',
    '&:hover': { backgroundColor: '#f59e0b' },
  },
  footer: {
    py: 6,
    backgroundColor: '#e2e8f0',
    color: '#1f2937',
  },
  footerLogo: {
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    mb: 2,
    color: '#667eea',
  },
  footerTitle: {
    fontWeight: 600,
    mb: 2,
    color: '#1f2937',
  },
  footerText: {
    color: '#4b5563',
    mb: 1,
  },
  footerLinks: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },
  footerLink: {
    color: '#4b5563',
    textDecoration: 'none',
    '&:hover': { color: '#667eea' },
    display: 'block',
    mb: 0.5,
  },
  footerBottom: {
    mt: 4,
    pt: 4,
    borderTop: '1px solid #cbd5e1',
  },
};

export default LandingPage;