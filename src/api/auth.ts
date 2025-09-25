import { apiClient } from './client';
import { LoginCredentials, LoginResponse, RegisterData, User } from '@/types/auth';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/api/accounts/auth/login/', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/api/accounts/auth/register/', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/api/accounts/auth/logout/');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/api/accounts/profile/');
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<{ access: string; refresh: string }> => {
    const response = await apiClient.post<{ access: string; refresh: string }>('/api/accounts/auth/token/refresh/', {
      refresh: refreshToken,
    });
    return response.data;
  },
};