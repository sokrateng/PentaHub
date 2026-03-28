import { create } from 'zustand';
import axios from 'axios';
import { authApi } from '@/services/api';
import type { User } from '@/types';

function getErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const serverMessage = err.response?.data?.error;

    if (!err.response || err.code === 'ERR_NETWORK') {
      return 'Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin veya birkaç dakika sonra tekrar deneyin.';
    }
    if (status === 404) {
      return serverMessage || 'E-posta adresi veya şifre hatalı.';
    }
    if (status === 400) {
      return serverMessage || 'Girilen bilgiler geçersiz. Lütfen kontrol edip tekrar deneyin.';
    }
    if (status === 401) {
      return 'E-posta adresi veya şifre hatalı.';
    }
    if (status && status >= 500) {
      return 'Sunucuda bir sorun oluştu. Lütfen birkaç dakika sonra tekrar deneyin.';
    }
    return serverMessage || fallback;
  }
  return fallback;
}

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
      set({ isLoading: false, error: getErrorMessage(err, 'Giriş yapılırken bir hata oluştu.') });
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
        set({ isLoading: false, error: response.error ?? 'Kayıt başarısız.' });
      }
    } catch (err: unknown) {
      set({ isLoading: false, error: getErrorMessage(err, 'Kayıt olurken bir hata oluştu.') });
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
