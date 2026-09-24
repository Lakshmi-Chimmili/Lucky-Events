import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('luckyevents_token'));
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  // Verify token on startup
  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('luckyevents_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.auth.getMe();
        if (res.success && res.user) {
          setUser(res.user);
        } else {
          localStorage.removeItem('luckyevents_token');
          setToken(null);
        }
      } catch (err) {
        console.warn('Session expired or invalid:', err.message);
        localStorage.removeItem('luckyevents_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.auth.login({ email, password });
      if (res.success && res.token) {
        localStorage.setItem('luckyevents_token', res.token);
        setToken(res.token);
        setUser(res.user);
        showToast(`Welcome back, ${res.user.name}!`, 'success');
        return { success: true };
      }
    } catch (err) {
      showToast(err.message || 'Login failed. Please check credentials.', 'error');
      return { success: false, error: err.message };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.auth.register(userData);
      if (res.success && res.token) {
        localStorage.setItem('luckyevents_token', res.token);
        setToken(res.token);
        setUser(res.user);
        showToast('Registration complete! Welcome aboard.', 'success');
        return { success: true };
      }
    } catch (err) {
      showToast(err.message || 'Registration failed.', 'error');
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('luckyevents_token');
    setToken(null);
    setUser(null);
    showToast('You have been logged out.', 'info');
  };

  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
    toast,
    showToast,
    hideToast,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
