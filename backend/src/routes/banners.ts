import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { bannerService } from '../services/banner.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { logger } from '../utils/logger.util';

const router = Router();

/**
 * GET /api/banners
 * Get all banners (public)
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

    const banners = await bannerService.getBanners({ isActive, limit });

    res.status(200).json({
      success: true,
      data: banners
    });
  } catch (error) {
    logger.error('❌ Get banners route error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch banners'
    });
  }
});

/**
 * POST /api/banners
 * Create new banner (protected)
 */
router.post(
  '/',
  authMiddleware,
  [
    body('title').isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
    body('description').isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),
    body('imageUrl').isURL().withMessage('Valid image URL is required'),
    body('ctaText').isLength({ min: 2, max: 50 }).withMessage('CTA text must be between 2 and 50 characters'),
    body('ctaLink').optional().isURL().withMessage('CTA link must be a valid URL'),
    body('order').optional().isInt({ min: 1 }).withMessage('Order must be a positive integer')
  ],
  async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
        return;
      }

      const banner = await bannerService.createBanner(req.body);

      res.status(201).json({
        success: true,
        data: banner
      });
    } catch (error: any) {
      logger.error('❌ Create banner route error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create banner'
      });
    }
  }
);

/**
 * PUT /api/banners/:id
 * Update banner (protected)
 */
router.put(
  '/:id',
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const banner = await bannerService.updateBanner(id, req.body);

      res.status(200).json({
        success: true,
        data: banner
      });
    } catch (error: any) {
      logger.error('❌ Update banner route error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update banner'
      });
    }
  }
);

/**
 * DELETE /api/banners/:id
 * Delete banner (protected)
 */
router.delete(
  '/:id',
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await bannerService.deleteBanner(id);

      res.status(200).json({
        success: true,
        message: 'Banner deleted successfully'
      });
    } catch (error: any) {
      logger.error('❌ Delete banner route error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete banner'
      });
    }
  }
);

export default router;
