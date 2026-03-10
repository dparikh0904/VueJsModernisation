import { apiClient } from '@/lib/api-client';
import { LoginCredentials, SignupCredentials, AuthResponse, User } from '@/types/auth';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/api/users/login', {
      user: credentials
    });
  },

  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/api/users/signup', {
      name: credentials.name,
      surname: credentials.surname || ' ',
      email: credentials.email,
      password: credentials.password
    });
  },

  getCurrentUser: async (): Promise<{ user: User }> => {
    return apiClient.get<{ user: User }>('/api/users/me');
  },

  logout: async (): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>('/api/auth/logout');
  },

  refresh: async (): Promise<{ user: User }> => {
    return apiClient.post<{ user: User }>('/api/auth/refresh');
  }
};