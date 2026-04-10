import { Request, Response, NextFunction } from 'express';
import { authService, AdminUser } from '../services/auth.service';
import { logger } from '../utils/logger.util';

// Extend Express Request to include admin user
declare global {
  namespace Express {
    interface Request {
      admin?: AdminUser;
    }
  }
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches admin user to request
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'No token provided'
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const admin = await authService.verifyToken(token);

    // Attach admin to request
    req.admin = admin;

    next();
  } catch (error) {
    logger.error('❌ Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

/**
 * Role-based authorization middleware
 * Checks if admin has required role
 */
export const requireRole = (...roles: Array<'admin' | 'super_admin'>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.admin) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    if (!roles.includes(req.admin.role)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
      return;
    }

    next();
  };
};
