import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { DEMO_USERS } from '../data/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user data on startup
  useEffect(() => {
    const loadUser = async () => {
      const userInfoStr = localStorage.getItem('userInfo');
      if (userInfoStr) {
        try {
          const userInfo = JSON.parse(userInfoStr);
          if (userInfo && userInfo.token) {
            try {
              // Verify token with backend
              const { data } = await API.get('/auth/me');
              if (data && data.success) {
                setUser({ ...data.data, token: userInfo.token });
              } else {
                setUser(userInfo);
              }
            } catch (apiErr) {
              // If server is 401 Unauthorized, clear session
              if (apiErr.response && apiErr.response.status === 401) {
                logout();
              } else {
                // Network error or backend asleep/offline: keep cached profile so user stays logged in!
                setUser(userInfo);
              }
            }
          }
        } catch (err) {
          console.error('Failed to parse cached user:', err);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Register action
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.post('/auth/register', userData);
      if (data.success) {
        setUser(data.data);
        localStorage.setItem('userInfo', JSON.stringify(data.data));
        setLoading(false);
        return { success: true };
      }
    } catch (err) {
      let msg = err.response?.data?.message;
      if (!msg) {
        if (err.code === 'ECONNABORTED' || err.message?.toLowerCase().includes('timeout')) {
          msg = 'Connection timed out. The backend server might be starting up or sleeping. Please try again in a few moments.';
        } else if (err.code === 'ERR_NETWORK' || !err.response) {
          msg = 'Cannot connect to backend server. Make sure your backend is running on port 5000 (run start_project.bat).';
        } else {
          msg = 'Registration failed. Please try again.';
        }
      }
      setError(msg);
      setLoading(false);
      return { success: false, message: msg };
    }
  };

  // Instant Demo Login (Zero-Downtime Guarantee)
  const demoLogin = (role = 'candidate') => {
    const demoUser = DEMO_USERS[role] || DEMO_USERS.candidate;
    setUser(demoUser);
    localStorage.setItem('userInfo', JSON.stringify(demoUser));
    return { success: true, isDemo: true };
  };

  // Login action
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    const cleanEmail = (email || '').trim().toLowerCase();

    try {
      const { data } = await API.post('/auth/login', { email, password });
      if (data && data.success) {
        setUser(data.data);
        localStorage.setItem('userInfo', JSON.stringify(data.data));
        setLoading(false);
        return { success: true };
      }
    } catch (err) {
      // Zero-downtime offline demo fallback if backend is offline/sleeping
      if (err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED' || !err.response || [502, 503, 504].includes(err.response?.status)) {
        if (cleanEmail === 'alex.turner@example.com') {
          return demoLogin('candidate');
        } else if (cleanEmail === 'sarah@stripe.com') {
          return demoLogin('recruiter');
        } else if (cleanEmail === 'admin@careerconnect.ai') {
          return demoLogin('admin');
        }
      }

      let msg = err.response?.data?.message;
      if (!msg) {
        if (err.code === 'ECONNABORTED' || err.message?.toLowerCase().includes('timeout')) {
          msg = 'Connection timed out. The cloud server is waking up. Please retry or click any Demo button for instant access.';
        } else if (err.code === 'ERR_NETWORK' || !err.response) {
          msg = 'Cannot reach backend server. If running locally, make sure port 5000 is running (run start_project.bat).';
        } else {
          msg = 'Invalid email or password. Please try again.';
        }
      }
      setError(msg);
      setLoading(false);
      return { success: false, message: msg };
    }
  };

  // Update profile in local state
  const updateProfileState = (updatedUserData) => {
    const newUserData = { ...updatedUserData, token: user?.token || 'demo-token' };
    setUser(newUserData);
    localStorage.setItem('userInfo', JSON.stringify(newUserData));
  };

  // Logout action
  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        demoLogin,
        logout,
        updateProfileState,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
