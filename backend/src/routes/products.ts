import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { productService } from '../services/product.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { logger } from '../utils/logger.util';

const router = Router();

/**
 * GET /api/products
 * Get all products with pagination and filters (public)
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const categoryId = req.query.categoryId as string | undefined;
    const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;
    const inStock = req.query.inStock === 'true' ? true : req.query.inStock === 'false' ? false : undefined;
    const search = req.query.search as string | undefined;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    const result = await productService.getProducts({
      categoryId,
      isActive,
      inStock,
      search,
      page,
      limit
    });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('❌ Get products route error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
});

/**
 * GET /api/products/:id
 * Get product by ID (public)
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    logger.error('❌ Get product by ID route error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product'
    });
  }
});

/**
 * POST /api/products
 * Create new product (protected)
 */
router.post(
  '/',
  authMiddleware,
  [
    body('name').isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('description').isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
    body('price').isFloat({ min: 0.01 }).withMessage('Price must be a positive number'),
    body('imageUrl').isURL().withMessage('Valid image URL is required'),
    body('categoryId').notEmpty().withMessage('Category ID is required'),
    body('stockQuantity').optional().isInt({ min: 0 }).withMessage('Stock quantity must be non-negative')
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

      const product = await productService.createProduct(req.body);

      res.status(201).json({
        success: true,
        data: product
      });
    } catch (error: any) {
      logger.error('❌ Create product route error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create product'
      });
    }
  }
);

/**
 * PUT /api/products/:id
 * Update product (protected)
 */
router.put(
  '/:id',
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const product = await productService.updateProduct(id, req.body);

      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error: any) {
      logger.error('❌ Update product route error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update product'
      });
    }
  }
);

/**
 * DELETE /api/products/:id
 * Delete product (protected)
 */
router.delete(
  '/:id',
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await productService.deleteProduct(id);

      res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error: any) {
      logger.error('❌ Delete product route error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete product'
      });
    }
  }
);

export default router;
