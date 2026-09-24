const API_ORIGIN = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/+$/, '')
  : '';
const BASE_URL = `${API_ORIGIN}/api`;

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('luckyevents_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const error = new Error(data.message || 'Something went wrong');
      error.status = res.status;
      error.errors = data.errors;
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const api = {
  // Auth
  auth: {
    login: (credentials) =>
      request('/auth/login', { method: 'POST', body: credentials }),
    register: (userData) =>
      request('/auth/register', { method: 'POST', body: userData }),
    getMe: () => request('/auth/me', { method: 'GET' }),
  },

  // Events
  events: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/events${query ? `?${query}` : ''}`, { method: 'GET' });
    },
    getFeatured: () => request('/events/featured', { method: 'GET' }),
    getById: (id) => request(`/events/${id}`, { method: 'GET' }),
    create: (eventData) =>
      request('/events', { method: 'POST', body: eventData }),
    update: (id, eventData) =>
      request(`/events/${id}`, { method: 'PUT', body: eventData }),
    delete: (id) => request(`/events/${id}`, { method: 'DELETE' }),
    getMyEvents: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/events/user/my-events${query ? `?${query}` : ''}`, {
        method: 'GET',
      });
    },
    sendReminders: (id) =>
      request(`/events/${id}/send-reminders`, { method: 'POST' }),
  },

  // RSVPs
  rsvps: {
    rsvp: (eventId, data) =>
      request(`/events/${eventId}/rsvp`, { method: 'POST', body: data }),
    cancel: (eventId) =>
      request(`/events/${eventId}/rsvp`, { method: 'DELETE' }),
    getMyRSVPs: () => request('/rsvps/my-rsvps', { method: 'GET' }),
    getEventRSVPs: (eventId) =>
      request(`/events/${eventId}/rsvps`, { method: 'GET' }),
    getStatus: (eventId) =>
      request(`/events/${eventId}/rsvp/status`, { method: 'GET' }),
  },

  // User
  user: {
    updateProfile: (data) =>
      request('/users/profile', { method: 'PUT', body: data }),
    updatePassword: (data) =>
      request('/users/password', { method: 'PUT', body: data }),
    getStats: () => request('/users/stats', { method: 'GET' }),
  },
};
