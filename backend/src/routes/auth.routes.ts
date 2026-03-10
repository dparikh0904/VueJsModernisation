import { Router } from 'express';
import { authService } from '../services/auth.service';
import { asyncHandler } from '../middleware/error.middleware';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';
import { LoginRequest, SignupRequest } from '../types/user';

const router = Router();

/**
 * POST /api/users/signup
 * Register a new user
 */
router.post('/signup', asyncHandler(async (req, res) => {
  const data: SignupRequest = req.body;

  const result = await authService.signup(data);

  if (result.errors) {
    return res.status(400).json(result);
  }

  return res.status(201).json(result);
}));

/**
 * POST /api/users/login
 * Authenticate user and return JWT token
 */
router.post('/login', asyncHandler(async (req, res) => {
  const { user }: LoginRequest = req.body;

  if (!user) {
    return res.status(400).json({
      errors: { message: 'Invalid request format' }
    });
  }

  const result = await authService.login(user.email, user.password);

  if (result.errors) {
    return res.status(401).json(result);
  }

  // Set HttpOnly cookie with access token
  res.cookie('token', result.user!.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000 // 15 minutes
  });

  return res.status(200).json({ user: result.user });
}));

/**
 * GET /api/users/me
 * Get current authenticated user
 */
router.get('/me', authMiddleware, asyncHandler(async (req, res) => {
  const authReq = req as AuthRequest;
  
  return res.status(200).json({
    user: authReq.user
  });
}));

/**
 * POST /api/auth/logout
 * Clear authentication cookie
 */
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({
    message: 'Logged out successfully'
  });
});

/**
 * POST /api/auth/refresh
 * Refresh access token (placeholder for future implementation)
 */
router.post('/refresh', authMiddleware, asyncHandler(async (req, res) => {
  const authReq = req as AuthRequest;
  
  // In production, this would generate a new access token using refresh token
  return res.status(200).json({
    user: authReq.user
  });
}));

export default router;