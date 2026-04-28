import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('access_token', access);

          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register/', userData);
    if (response.data.tokens) {
      localStorage.setItem('access_token', response.data.tokens.access);
      localStorage.setItem('refresh_token', response.data.tokens.refresh);
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login/', credentials);
    if (response.data.tokens) {
      localStorage.setItem('access_token', response.data.tokens.access);
      localStorage.setItem('refresh_token', response.data.tokens.refresh);
    }
    return response.data;
  },

  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await api.post('/auth/logout/', { refresh: refreshToken });
      }
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me/');
    return response.data;
  },
};

export const doctorService = {
  getDoctors: async (specialization = null) => {
    const params = specialization ? { specialization } : {};
    const response = await api.get('/doctors/', { params });
    return response.data;
  },

  getDoctor: async (id) => {
    const response = await api.get(`/doctors/${id}/`);
    return response.data;
  },
};

export const appointmentService = {
  getAppointments: async () => {
    const response = await api.get('/appointments/');
    return response.data;
  },

  createAppointment: async (appointmentData) => {
    const response = await api.post('/appointments/', appointmentData);
    return response.data;
  },

  updateAppointment: async (id, updateData) => {
    const response = await api.patch(`/appointments/${id}/`, updateData);
    return response.data;
  },

  acceptAppointment: async (id) => {
    const response = await api.patch(`/appointments/${id}/`, { status: 'accepted' });
    return response.data;
  },

  postponeAppointment: async (id, notes) => {
    const response = await api.patch(`/appointments/${id}/`, { status: 'postponed', notes });
    return response.data;
  },
};

export const scheduleService = {
  getSchedules: async (date = null) => {
    const params = date ? { date } : {};
    const response = await api.get('/schedules/', { params });
    return response.data;
  },
};

export default api;