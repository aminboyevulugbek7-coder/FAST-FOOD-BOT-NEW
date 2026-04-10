import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authService } from '../services/auth.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { logger } from '../utils/logger.util';

const router = Router();

/**
 * POST /api/auth/login
 * Admin login endpoint
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req: Request, res: Response): Promise<void> => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
        return;
      }

      const { email, password } = req.body;

      // Attempt login
      const result = await authService.login(email, password);

      if (!result.success) {
        res.status(401).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      logger.error('❌ Login route error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

/**
 * GET /api/auth/me
 * Get current admin user info
 */
router.get(
  '/me',
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      res.status(200).json({
        success: true,
        user: req.admin
      });
    } catch (error) {
      logger.error('❌ Get me route error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

/**
 * POST /api/auth/seed-admin
 * Development-only endpoint to create admin user
 * WARNING: Remove this in production!
 */
if (process.env.NODE_ENV === 'development') {
  router.post(
    '/seed-admin',
    async (req: Request, res: Response): Promise<void> => {
      try {
        const email = process.env.ADMIN_EMAIL || 'admin@fastfood.com';
        const password = process.env.ADMIN_PASSWORD || 'admin123';
        const name = process.env.ADMIN_NAME || 'Admin User';
        const role = 'super_admin';

        const adminId = await authService.createAdmin(email, password, name, role);

        logger.info(`✅ Admin user created via API: ${email}`);

        res.status(201).json({
          success: true,
          message: 'Admin user created successfully',
          admin: {
            id: adminId,
            email,
            name,
            role
          }
        });
      } catch (error: any) {
        logger.error('❌ Seed admin via API error:', error);
        res.status(500).json({
          success: false,
          message: error.message || 'Failed to create admin user'
        });
      }
    }
  );
}

export default router;
