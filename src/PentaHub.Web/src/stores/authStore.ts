import { create } from 'zustand';
import { authApi } from '@/services/api';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string, department?: string) => Promise<void>;
  logout: () => void;
  loadFromStorage: () => void;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  loadFromStorage: () => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('auth_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        set({ user, token, isAuthenticated: true });
      } catch {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login({ email, password });
      if (response.success && response.data) {
        const { token, user } = response.data;
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user));
        set({ user, token, isAuthenticated: true, isLoading: false, error: null });
      } else {
        set({ isLoading: false, error: response.error ?? 'Giriş başarısız' });
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Giriş yapılırken bir hata oluştu';
      set({ isLoading: false, error: message });
      throw err;
    }
  },

  register: async (fullName: string, email: string, password: string, department?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.register({ fullName, email, password, department });
      if (response.success && response.data) {
        const { token, user } = response.data;
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user));
        set({ user, token, isAuthenticated: true, isLoading: false, error: null });
      } else {
        set({ isLoading: false, error: response.error ?? 'Kayıt başarısız' });
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Kayıt olurken bir hata oluştu';
      set({ isLoading: false, error: message });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  clearError: () => set({ error: null }),
}));
