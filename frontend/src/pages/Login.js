import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { TextField, Button, MenuItem, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-paper">
        <h1 className="login-title">MediScheduler</h1>
        <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#666' }}>Sign In</h2>

        {error && (
          <Alert severity="error" style={{ marginBottom: '16px' }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            required
            variant="outlined"
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            variant="outlined"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            style={{
              marginTop: '24px',
              marginBottom: '16px',
              padding: '12px',
              backgroundColor: '#667eea',
              fontSize: '16px',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <p style={{ textAlign: 'center', color: '#666', marginTop: '16px' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#667eea', textDecoration: 'none' }}>
            Sign Up
          </Link>
        </p>
        
        <p style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link to="/" style={{ color: '#667eea', textDecoration: 'none' }}>
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;