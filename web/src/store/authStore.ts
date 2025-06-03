import { create } from 'zustand';
import { User } from '../types/api';
import { getCurrentUser, isAuthenticated } from '../lib/auth';
import { login as apiLogin, logout as apiLogout } from '../services/authService';
import { LoginRequest } from '../types/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  checkAuth: () => {
    const authenticated = isAuthenticated();
    const user = getCurrentUser();

    set({
      isAuthenticated: authenticated,
      user: authenticated ? user : null,
    });
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });

    try {
      await apiLogin(credentials);
      const user = getCurrentUser();

      set({
        isAuthenticated: true,
        user,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: error.message || 'Failed to login',
      });
      throw error;
    }
  },

  logout: () => {
    apiLogout();
    set({
      isAuthenticated: false,
      user: null,
      error: null,
    });
  },
}));