import { create } from 'zustand';
import api from '../services/api';
import type { AuthState, User, AuthToken } from '../types';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (
    organizationName: string,
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  restoreSession: () => void;
}

function decodeToken(token: string) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,  // Start as true to prevent premature redirects
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const res = await api.post('/api/auth/login', { email, password });
      const token: AuthToken = res.data.token;

      const payload = decodeToken(token);
      if (!payload) throw new Error('Invalid token');

      const user: User = {
        id: payload.userId,
        organizationId: payload.organizationId,
        role: payload.role,
        email,
      };

      localStorage.setItem('token', token);

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err?.response?.data?.error || 'Login failed',
        isLoading: false,
      });
      throw err;
    }
  },

  register: async (organizationName, name, email, password) => {
    set({ isLoading: true, error: null });

    try {
      await api.post('/api/auth/signup', {
        organizationName,
        name,
        email,
        password,
      });

      await useAuthStore.getState().login(email, password);
    } catch (err: any) {
      set({
        error: err?.response?.data?.error || 'Registration failed',
        isLoading: false,
      });
      throw err;
    }
  },

  restoreSession: () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isLoading: false });
      return;
    }

    const payload = decodeToken(token);
    if (!payload) {
      localStorage.removeItem('token');
      set({ isLoading: false });
      return;
    }

    set({
      token,
      isAuthenticated: true,
      isLoading: false,
      user: {
        id: payload.userId,
        organizationId: payload.organizationId,
        role: payload.role,
      },
    });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },
}));
