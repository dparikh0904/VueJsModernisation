export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDTO {
  id: string;
  name: string;
  surname: string;
  email: string;
}

export interface LoginRequest {
  user: {
    email: string;
    password: string;
  };
}

export interface SignupRequest {
  name: string;
  surname: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user?: UserDTO;
  errors?: Record<string, string>;
}

export interface JWTPayload {
  id: string;
  name: string;
  surname: string;
  email: string;
  iat?: number;
  exp?: number;
}