import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email required.')
    .email('Invalid email.'),
  password: z
    .string()
    .min(1, 'Password required.')
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Username required.'),
  email: z
    .string()
    .min(1, 'Email required.')
    .email('Invalid email.'),
  password: z
    .string()
    .min(1, 'Password required.')
});

export type RegisterFormData = z.infer<typeof registerSchema>;