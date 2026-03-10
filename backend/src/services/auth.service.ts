import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { userRepository } from '../repositories/user.repository';
import { JWTPayload, SignupRequest, UserDTO } from '../types/user';

export class AuthService {
  async signup(data: SignupRequest): Promise<{ user?: UserDTO; errors?: Record<string, string> }> {
    // Validate input
    const errors: Record<string, string> = {};

    if (!data.email || data.email.trim() === '') {
      errors.email = 'Email required.';
    } else if (!this.isValidEmail(data.email)) {
      errors.email = 'Invalid email.';
    }

    if (!data.name || data.name.trim() === '') {
      errors.name = 'Username required.';
    }

    if (!data.password || data.password.trim() === '') {
      errors.password = 'Password required.';
    }

    if (Object.keys(errors).length > 0) {
      return { errors };
    }

    // Check if user already exists
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      return { errors: { email: 'Email already exists' } };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await userRepository.create({
      name: data.name,
      surname: data.surname || ' ',
      email: data.email,
      password: hashedPassword
    });

    return { user: userRepository.toDTO(user) };
  }

  async login(email: string, password: string): Promise<{ user?: UserDTO & { token: string }; errors?: Record<string, string> }> {
    const errors: Record<string, string> = {};

    if (!email || email.trim() === '') {
      errors.email = 'Email required.';
    } else if (!this.isValidEmail(email)) {
      errors.email = 'Invalid email.';
    }

    if (!password || password.trim() === '') {
      errors.password = 'Password required.';
    }

    if (Object.keys(errors).length > 0) {
      return { errors };
    }

    // Find user
    const user = await userRepository.findByEmail(email);
    if (!user) {
      return { errors: { email: 'Invalid credentials' } };
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return { errors: { password: 'Invalid credentials' } };
    }

    // Generate JWT token
    const payload: JWTPayload = {
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email
    };

    const token = jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_ACCESS_EXPIRY
    });

    return {
      user: {
        ...userRepository.toDTO(user),
        token
      }
    };
  }

  async getCurrentUser(token: string): Promise<UserDTO | null> {
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET) as JWTPayload;
      const user = await userRepository.findById(decoded.id);
      
      if (!user) return null;
      
      return userRepository.toDTO(user);
    } catch (error) {
      return null;
    }
  }

  verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, config.JWT_SECRET) as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  private isValidEmail(email: string): boolean {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
}

export const authService = new AuthService();