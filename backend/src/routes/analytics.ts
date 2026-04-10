import { Router, Request, Response } from 'express';
import { analyticsService } from '../services/analytics.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { logger } from '../utils/logger.util';

const router = Router();

/**
 * GET /api/analytics/dashboard
 * Get dashboard metrics (protected)
 */
router.get(
  '/dashboard',
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();

      // Validate date range (max 1 year)
      const oneYear = 365 * 24 * 60 * 60 * 1000;
      if (endDate.getTime() - startDate.getTime() > oneYear) {
        res.status(400).json({
          success: false,
          message: 'Date range cannot exceed 1 year'
        });
        return;
      }

      const metrics = await analyticsService.getDashboardMetrics(startDate, endDate);

      res.status(200).json({
        success: true,
        data: metrics
      });
    } catch (error) {
      logger.error('❌ Get dashboard metrics route error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard metrics'
      });
    }
  }
);

/**
 * GET /api/analytics/orders-over-time
 * Get orders time series data (protected)
 */
router.get(
  '/orders-over-time',
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();
      const groupBy = (req.query.groupBy as 'day' | 'week' | 'month') || 'day';

      if (!['day', 'week', 'month'].includes(groupBy)) {
        res.status(400).json({
          success: false,
          message: 'Invalid groupBy parameter. Must be day, week, or month'
        });
        return;
      }

      const data = await analyticsService.getOrdersOverTime(startDate, endDate, groupBy);

      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      logger.error('❌ Get orders over time route error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch orders over time'
      });
    }
  }
);

/**
 * GET /api/analytics/revenue-over-time
 * Get revenue time series data (protected)
 */
router.get(
  '/revenue-over-time',
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();
      const groupBy = (req.query.groupBy as 'day' | 'week' | 'month') || 'day';

      if (!['day', 'week', 'month'].includes(groupBy)) {
        res.status(400).json({
          success: false,
          message: 'Invalid groupBy parameter. Must be day, week, or month'
        });
        return;
      }

      const data = await analyticsService.getRevenueOverTime(startDate, endDate, groupBy);

      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      logger.error('❌ Get revenue over time route error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch revenue over time'
      });
    }
  }
);

export default router;
