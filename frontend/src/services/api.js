import axios from 'axios';
import { DEMO_JOBS, DEMO_APPLICATIONS, DEMO_ADMIN_STATS } from '../data/mockData';

export const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    // Localhost or LAN access
    if (host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.') || host.startsWith('10.') || host === '0.0.0.0') {
      const targetHost = (host === 'localhost' || host === '127.0.0.1') ? 'localhost' : host;
      return `http://${targetHost}:5000/api`;
    }
  }
  return 'https://career-connect-t2k4.onrender.com/api';
};

export const getFileUrl = (filePath) => {
  if (!filePath) return '';
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) return filePath;
  const baseUrl = getApiBaseUrl().replace(/\/api\/?$/, '');
  return `${baseUrl}${filePath.startsWith('/') ? '' : '/'}${filePath}`;
};

const API = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 10000, // 10s request timeout safeguard
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
API.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const { token } = JSON.parse(userInfo);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.error('Error parsing userInfo from localStorage:', err);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with zero-downtime offline fallback
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    const method = (error.config?.method || 'get').toLowerCase();

    // If backend is sleeping, cold-starting or offline, serve cached mock demo data
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED' || !error.response || [502, 503, 504].includes(error.response?.status)) {
      if (method === 'get') {
        if (url.includes('/jobs/') && !url.endsWith('/jobs')) {
          return Promise.resolve({ data: { success: true, data: DEMO_JOBS[0] } });
        }
        if (url.includes('/jobs')) {
          return Promise.resolve({ data: { success: true, data: DEMO_JOBS, total: DEMO_JOBS.length } });
        }
        if (url.includes('/applications/my')) {
          return Promise.resolve({ data: { success: true, data: DEMO_APPLICATIONS } });
        }
        if (url.includes('/admin/stats')) {
          return Promise.resolve({ data: { success: true, data: DEMO_ADMIN_STATS } });
        }
        if (url.includes('/notifications')) {
          return Promise.resolve({ data: { success: true, data: [] } });
        }
      }
    }
    return Promise.reject(error);
  }
);

export default API;
