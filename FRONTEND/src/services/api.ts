import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* =======================
   REQUEST INTERCEPTOR
   ======================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* =======================
   RESPONSE INTERCEPTOR
   ======================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      // Global unauthorized → logout
      useAuthStore.getState().logout();
    }

    if (status === 403) {
      error.message = 'Permission denied';
    }

    if (status === 500) {
      error.message = 'Something went wrong. Please try again.';
    }

    return Promise.reject(error);
  }
);

export default api;
