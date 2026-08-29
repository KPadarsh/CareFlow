import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hydrate user session on app boot from HttpOnly cookies
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await API.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (err) {
        // Cookie is expired, invalid, or missing - user is unauthenticated
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Handle user login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data.success) {
        setUser(res.data.user);
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Invalid email or password.',
      };
    } finally {
      setLoading(false);
    }
  };

  // Handle user registration (returns success, forces manual login)
  const register = async (name, email, password, phone, gender, address) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/register', { name, email, password, phone, gender, address });
      if (res.data.success) {
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed.',
      };
    } finally {
      setLoading(false);
    }
  };

  // Handle user logout (tells backend to clear cookie, then updates state)
  const logout = async () => {
    setLoading(true);
    try {
      await API.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
