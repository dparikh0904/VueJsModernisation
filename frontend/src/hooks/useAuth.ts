import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { LoginCredentials, SignupCredentials } from '@/types/auth';

export function useAuth() {
  const { user, setUser, clearUser } = useAuthStore();
  
  const { data, isLoading } = useQuery({
    queryKey: ['auth', 'currentUser'],
    queryFn: async () => {
      try {
        const response = await authApi.getCurrentUser();
        setUser(response.user);
        return response.user;
      } catch (error) {
        clearUser();
        throw error;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000
  });

  return {
    user: user || data,
    isAuthenticated: !!(user || data),
    isLoading
  };
}

export function useLogin() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      if (data.user) {
        setUser(data.user);
        queryClient.setQueryData(['auth', 'currentUser'], data.user);
        navigate('/');
      }
    }
  });
}

export function useSignup() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: SignupCredentials) => authApi.signup(credentials),
    onSuccess: (data) => {
      if (data.user) {
        // Redirect to login page with email pre-filled via query param
        navigate(`/login?email=${encodeURIComponent(data.user.email)}`);
      }
    }
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const { clearUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearUser();
      queryClient.clear();
      navigate('/login');
    }
  });
}