export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  surname?: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user?: User & { token?: string };
  errors?: Record<string, string>;
}

export interface ApiError {
  status: string;
  message: string;
  errors?: Record<string, string>;
}