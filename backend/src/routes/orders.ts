import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { orderService, OrderStatus } from '../services/order.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { logger } from '../utils/logger.util';

const router = Router();

/**
 * POST /api/orders
 * Create new order (public - from customer app)
 */
router.post(
  '/',
  [
    body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('items.*.productId').notEmpty().withMessage('Product ID is required'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('customerInfo.name').notEmpty().withMessage('Customer name is required'),
    body('customerInfo.phone').notEmpty().withMessage('Customer phone is required'),
    body('customerInfo.address').notEmpty().withMessage('Customer address is required'),
    body('paymentMethod').isIn(['cash', 'card', 'online']).withMessage('Invalid payment method')
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

      const order = await orderService.createOrder(req.body);

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: order
      });
    } catch (error: any) {
      logger.error('❌ Create order route error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create order'
      });
    }
  }
);

/**
 * GET /api/orders
 * Get all orders with filters (protected)
 */
router.get(
  '/',
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const status = req.query.status as OrderStatus | undefined;
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
      const search = req.query.search as string | undefined;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

      const result = await orderService.getOrders({
        status,
        startDate,
        endDate,
        search,
        page,
        limit
      });

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error('❌ Get orders route error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch orders'
      });
    }
  }
);

/**
 * GET /api/orders/:id
 * Get order by ID (protected)
 */
router.get(
  '/:id',
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const order = await orderService.getOrderById(id);

      if (!order) {
        res.status(404).json({
          success: false,
          message: 'Order not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: order
      });
    } catch (error) {
      logger.error('❌ Get order by ID route error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch order'
      });
    }
  }
);

/**
 * PATCH /api/orders/:id/status
 * Update order status (protected)
 */
router.patch(
  '/:id/status',
  authMiddleware,
  [
    body('status').isIn(['pending', 'confirmed', 'preparing', 'delivering', 'completed', 'cancelled']).withMessage('Invalid status'),
    body('note').optional().isString().withMessage('Note must be a string')
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

      const { id } = req.params;
      const { status, note } = req.body;
      const updatedBy = req.admin?.id;

      const order = await orderService.updateOrderStatus(id, status, note, updatedBy);

      res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
        data: order
      });
    } catch (error: any) {
      logger.error('❌ Update order status route error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update order status'
      });
    }
  }
);

export default router;
