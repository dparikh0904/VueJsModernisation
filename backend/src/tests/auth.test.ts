import { describe, it, expect, beforeEach } from 'vitest';
import { userRepository } from '../repositories/user.repository';
import { authService } from '../services/auth.service';

describe('AuthService', () => {
  beforeEach(async () => {
    // Clear in-memory database before each test
    const users = await userRepository.count();
    // Note: In production, implement a proper cleanup method
  });

  describe('signup', () => {
    it('should create a new user with valid credentials', async () => {
      const result = await authService.signup({
        name: 'John Doe',
        surname: 'Doe',
        email: 'john@example.com',
        password: 'SecurePass123'
      });

      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe('john@example.com');
      expect(result.user?.name).toBe('John Doe');
      expect(result.errors).toBeUndefined();
    });

    it('should return error when email is missing', async () => {
      const result = await authService.signup({
        name: 'John Doe',
        surname: '',
        email: '',
        password: 'password'
      });

      expect(result.errors).toBeDefined();
      expect(result.errors?.email).toBe('Email required.');
    });

    it('should return error when email format is invalid', async () => {
      const result = await authService.signup({
        name: 'John Doe',
        surname: '',
        email: 'invalid-email',
        password: 'password'
      });

      expect(result.errors).toBeDefined();
      expect(result.errors?.email).toBe('Invalid email.');
    });

    it('should return error when username is missing', async () => {
      const result = await authService.signup({
        name: '',
        surname: '',
        email: 'john@example.com',
        password: 'password'
      });

      expect(result.errors).toBeDefined();
      expect(result.errors?.name).toBe('Username required.');
    });

    it('should return error when password is missing', async () => {
      const result = await authService.signup({
        name: 'John Doe',
        surname: '',
        email: 'john@example.com',
        password: ''
      });

      expect(result.errors).toBeDefined();
      expect(result.errors?.password).toBe('Password required.');
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      // Create a test user
      await authService.signup({
        name: 'Test User',
        surname: 'User',
        email: 'test@example.com',
        password: 'TestPass123'
      });
    });

    it('should login with valid credentials', async () => {
      const result = await authService.login('test@example.com', 'TestPass123');

      expect(result.user).toBeDefined();
      expect(result.user?.token).toBeDefined();
      expect(result.user?.email).toBe('test@example.com');
      expect(result.errors).toBeUndefined();
    });

    it('should return error with invalid email', async () => {
      const result = await authService.login('wrong@example.com', 'TestPass123');

      expect(result.errors).toBeDefined();
      expect(result.errors?.email).toBe('Invalid credentials');
    });

    it('should return error with invalid password', async () => {
      const result = await authService.login('test@example.com', 'WrongPassword');

      expect(result.errors).toBeDefined();
      expect(result.errors?.password).toBe('Invalid credentials');
    });

    it('should return error when email is missing', async () => {
      const result = await authService.login('', 'password');

      expect(result.errors).toBeDefined();
      expect(result.errors?.email).toBe('Email required.');
    });

    it('should return error when password is missing', async () => {
      const result = await authService.login('test@example.com', '');

      expect(result.errors).toBeDefined();
      expect(result.errors?.password).toBe('Password required.');
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', async () => {
      const loginResult = await authService.signup({
        name: 'Token User',
        surname: 'User',
        email: 'token@example.com',
        password: 'TokenPass123'
      });

      const loginResponse = await authService.login('token@example.com', 'TokenPass123');
      const token = loginResponse.user!.token;

      const decoded = authService.verifyToken(token);
      expect(decoded).toBeDefined();
      expect(decoded?.email).toBe('token@example.com');
    });

    it('should return null for invalid token', () => {
      const decoded = authService.verifyToken('invalid-token');
      expect(decoded).toBeNull();
    });
  });
});