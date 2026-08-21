import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

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
            // Verify token and fetch profile details
            const { data } = await API.get('/auth/me');
            if (data.success) {
              // Merge token with fetched profile info
              setUser({ ...data.data, token: userInfo.token });
            } else {
              logout();
            }
          }
        } catch (err) {
          console.error('Failed to load user profile:', err);
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
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
      setLoading(false);
      return { success: false, message: msg };
    }
  };

  // Login action
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      if (data.success) {
        setUser(data.data);
        localStorage.setItem('userInfo', JSON.stringify(data.data));
        setLoading(false);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password';
      setError(msg);
      setLoading(false);
      return { success: false, message: msg };
    }
  };

  // Update profile in local state
  const updateProfileState = (updatedUserData) => {
    // Keep JWT token
    const newUserData = { ...updatedUserData, token: user.token };
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
