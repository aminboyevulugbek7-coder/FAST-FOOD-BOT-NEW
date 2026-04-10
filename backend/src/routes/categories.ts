import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { categoryService } from '../services/category.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { logger } from '../utils/logger.util';

const router = Router();

/**
 * GET /api/categories
 * Get all categories (public)
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;
    const search = req.query.search as string | undefined;

    const categories = await categoryService.getCategories({ isActive, search });

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    logger.error('❌ Get categories route error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
});

/**
 * POST /api/categories
 * Create new category (protected)
 */
router.post(
  '/',
  authMiddleware,
  [
    body('name').isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('description').isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),
    body('imageUrl').isURL().withMessage('Valid image URL is required'),
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

      const category = await categoryService.createCategory(req.body);

      res.status(201).json({
        success: true,
        data: category
      });
    } catch (error: any) {
      logger.error('❌ Create category route error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create category'
      });
    }
  }
);

/**
 * PUT /api/categories/:id
 * Update category (protected)
 */
router.put(
  '/:id',
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const category = await categoryService.updateCategory(id, req.body);

      res.status(200).json({
        success: true,
        data: category
      });
    } catch (error: any) {
      logger.error('❌ Update category route error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update category'
      });
    }
  }
);

/**
 * DELETE /api/categories/:id
 * Delete category (protected)
 */
router.delete(
  '/:id',
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await categoryService.deleteCategory(id);

      res.status(200).json({
        success: true,
        message: 'Category deleted successfully'
      });
    } catch (error: any) {
      logger.error('❌ Delete category route error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete category'
      });
    }
  }
);

/**
 * POST /api/categories/reorder
 * Reorder categories (protected)
 */
router.post(
  '/reorder',
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { orders } = req.body;

      if (!Array.isArray(orders)) {
        res.status(400).json({
          success: false,
          message: 'Orders must be an array'
        });
        return;
      }

      await categoryService.reorderCategories(orders);

      res.status(200).json({
        success: true,
        message: 'Categories reordered successfully'
      });
    } catch (error: any) {
      logger.error('❌ Reorder categories route error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to reorder categories'
      });
    }
  }
);

export default router;
