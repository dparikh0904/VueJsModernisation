import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    surname: string;
    email: string;
  };
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authReq = req as AuthRequest;
  
  // Check for token in cookie
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication required'
    });
  }

  // Verify token
  const decoded = authService.verifyToken(token);

  if (!decoded) {
    res.clearCookie('token');
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token'
    });
  }

  // Attach user to request
  authReq.user = {
    id: decoded.id,
    name: decoded.name,
    surname: decoded.surname,
    email: decoded.email
  };

  next();
}