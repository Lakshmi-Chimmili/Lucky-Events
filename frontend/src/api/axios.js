import axios from 'axios';

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return '/api';
  const clean = envUrl.replace(/\/+$/, '');
  return clean.endsWith('/api') ? clean : `${clean}/api`;
};

export const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor injecting JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('luckyevents_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor extracting readable error message
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    const customError = new Error(message);
    customError.status = error.response?.status;
    customError.data = error.response?.data;
    return Promise.reject(customError);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

export const categoryAPI = {
  getAll: (includeInactive = false) =>
    api.get(`/categories${includeInactive ? '?includeInactive=true' : ''}`),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const serviceAPI = {
  getAll: (includeInactive = false) =>
    api.get(`/services${includeInactive ? '?includeInactive=true' : ''}`),
  getById: (id) => api.get(`/services/${id}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
};

export const bookingAPI = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getMy: () => api.get('/bookings/my'),
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/bookings${query ? `?${query}` : ''}`);
  },
  getAssigned: () => api.get('/bookings/assigned'),
  updateStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status }),
  assignStaff: (id, staffIds) => api.patch(`/bookings/${id}/assign`, { staffIds }),
  delete: (id) => api.delete(`/bookings/${id}`),
  getStats: () => api.get('/bookings/stats'),
};

export const staffAPI = {
  getAll: () => api.get('/staff'),
  create: (staffData) => api.post('/staff', staffData),
};

export default api;
