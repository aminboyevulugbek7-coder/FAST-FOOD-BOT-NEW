import { firebaseService } from './firebase.service';
import { logger } from '../utils/logger.util';
import { OrderStatus } from './order.service';

export interface DashboardMetrics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  completedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  topProducts: ProductStats[];
  revenueGrowth: number;
  orderGrowth: number;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
}

export interface ProductStats {
  productId: string;
  productName: string;
  totalOrders: number;
  totalQuantity: number;
  totalRevenue: number;
}

export class AnalyticsService {
  private static instance: AnalyticsService;
  private readonly COLLECTION = 'orders';
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  /**
   * Get dashboard metrics
   */
  async getDashboardMetrics(startDate: Date, endDate: Date): Promise<DashboardMetrics> {
    try {
      const cacheKey = `dashboard-${startDate.getTime()}-${endDate.getTime()}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }

      const firestore = firebaseService.getFirestore();

      // Query orders in date range
      const ordersSnapshot = await firestore
        .collection(this.COLLECTION)
        .where('createdAt', '>=', startDate)
        .where('createdAt', '<=', endDate)
        .get();

      const orders = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];

      // Initialize metrics
      let totalOrders = 0;
      let totalRevenue = 0;
      let completedOrders = 0;
      let pendingOrders = 0;
      let cancelledOrders = 0;
      const productStats = new Map<string, ProductStats>();

      // Process each order
      for (const order of orders) {
        totalOrders++;

        // Count by status
        if (order.status === 'completed') {
          completedOrders++;
          totalRevenue += order.totalAmount;

          // Aggregate product statistics
          for (const item of order.items) {
            const existing = productStats.get(item.productId);

            if (existing) {
              existing.totalOrders++;
              existing.totalQuantity += item.quantity;
              existing.totalRevenue += item.subtotal;
            } else {
              productStats.set(item.productId, {
                productId: item.productId,
                productName: item.productName,
                totalOrders: 1,
                totalQuantity: item.quantity,
                totalRevenue: item.subtotal
              });
            }
          }
        } else if (order.status === 'pending') {
          pendingOrders++;
        } else if (order.status === 'cancelled') {
          cancelledOrders++;
        }
      }

      // Calculate derived metrics
      const averageOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0;

      // Get top products
      const topProducts = Array.from(productStats.values())
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, 10);

      // Calculate growth
      const previousPeriodMetrics = await this.calculatePreviousPeriodMetrics(startDate, endDate);
      const revenueGrowth = this.calculateGrowthPercentage(totalRevenue, previousPeriodMetrics.revenue);
      const orderGrowth = this.calculateGrowthPercentage(totalOrders, previousPeriodMetrics.orders);

      const metrics: DashboardMetrics = {
        totalOrders,
        totalRevenue,
        averageOrderValue,
        completedOrders,
        pendingOrders,
        cancelledOrders,
        topProducts,
        revenueGrowth,
        orderGrowth
      };

      this.setCache(cacheKey, metrics);

      return metrics;
    } catch (error) {
      logger.error('❌ Get dashboard metrics error:', error);
      throw error;
    }
  }

  /**
   * Get orders over time
   */
  async getOrdersOverTime(
    startDate: Date,
    endDate: Date,
    groupBy: 'day' | 'week' | 'month'
  ): Promise<TimeSeriesData[]> {
    try {
      const firestore = firebaseService.getFirestore();

      const ordersSnapshot = await firestore
        .collection(this.COLLECTION)
        .where('createdAt', '>=', startDate)
        .where('createdAt', '<=', endDate)
        .get();

      const orders = ordersSnapshot.docs.map(doc => ({
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));

      // Group orders by time period
      const grouped = this.groupByTimePeriod(orders, groupBy, 'createdAt');

      return grouped;
    } catch (error) {
      logger.error('❌ Get orders over time error:', error);
      throw error;
    }
  }

  /**
   * Get revenue over time
   */
  async getRevenueOverTime(
    startDate: Date,
    endDate: Date,
    groupBy: 'day' | 'week' | 'month'
  ): Promise<TimeSeriesData[]> {
    try {
      const firestore = firebaseService.getFirestore();

      const ordersSnapshot = await firestore
        .collection(this.COLLECTION)
        .where('createdAt', '>=', startDate)
        .where('createdAt', '<=', endDate)
        .where('status', '==', 'completed')
        .get();

      const orders = ordersSnapshot.docs.map(doc => ({
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));

      // Group revenue by time period
      const grouped = this.groupByTimePeriod(orders, groupBy, 'createdAt', 'totalAmount');

      return grouped;
    } catch (error) {
      logger.error('❌ Get revenue over time error:', error);
      throw error;
    }
  }

  /**
   * Get top products
   */
  async getTopProducts(startDate: Date, endDate: Date, limit: number = 10): Promise<ProductStats[]> {
    try {
      const metrics = await this.getDashboardMetrics(startDate, endDate);
      return metrics.topProducts.slice(0, limit);
    } catch (error) {
      logger.error('❌ Get top products error:', error);
      throw error;
    }
  }

  /**
   * Calculate previous period metrics
   */
  private async calculatePreviousPeriodMetrics(
    startDate: Date,
    endDate: Date
  ): Promise<{ revenue: number; orders: number }> {
    try {
      const periodLength = endDate.getTime() - startDate.getTime();
      const previousStartDate = new Date(startDate.getTime() - periodLength);
      const previousEndDate = new Date(startDate.getTime());

      const firestore = firebaseService.getFirestore();

      const ordersSnapshot = await firestore
        .collection(this.COLLECTION)
        .where('createdAt', '>=', previousStartDate)
        .where('createdAt', '<', previousEndDate)
        .get();

      let revenue = 0;
      let orders = 0;

      ordersSnapshot.docs.forEach(doc => {
        const data = doc.data();
        orders++;
        if (data.status === 'completed') {
          revenue += data.totalAmount;
        }
      });

      return { revenue, orders };
    } catch (error) {
      logger.error('❌ Calculate previous period metrics error:', error);
      return { revenue: 0, orders: 0 };
    }
  }

  /**
   * Calculate growth percentage
   */
  private calculateGrowthPercentage(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }

  /**
   * Group data by time period
   */
  private groupByTimePeriod(
    data: any[],
    groupBy: 'day' | 'week' | 'month',
    dateField: string,
    valueField?: string
  ): TimeSeriesData[] {
    const grouped = new Map<string, number>();

    for (const item of data) {
      const date = item[dateField];
      if (!date) continue;

      let key: string;
      if (groupBy === 'day') {
        key = date.toISOString().slice(0, 10);
      } else if (groupBy === 'week') {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().slice(0, 10);
      } else {
        key = date.toISOString().slice(0, 7);
      }

      const value = valueField ? item[valueField] : 1;
      grouped.set(key, (grouped.get(key) || 0) + value);
    }

    return Array.from(grouped.entries())
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Get from cache
   */
  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > this.CACHE_TTL) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  /**
   * Set cache
   */
  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
}

export const analyticsService = AnalyticsService.getInstance();
