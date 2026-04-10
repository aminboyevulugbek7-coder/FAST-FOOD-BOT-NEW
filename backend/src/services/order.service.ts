import { firebaseService } from './firebase.service';
import { productService } from './product.service';
import { logger } from '../utils/logger.util';

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'completed' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  telegramUserId?: number;
}

export interface OrderHistoryEntry {
  status: OrderStatus;
  timestamp: Date;
  note?: string;
  updatedBy?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  customerInfo: CustomerInfo;
  paymentMethod: 'cash' | 'card' | 'online';
  status: OrderStatus;
  comment?: string;
  statusHistory: OrderHistoryEntry[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderDto {
  items: Array<{ productId: string; quantity: number }>;
  customerInfo: CustomerInfo;
  paymentMethod: 'cash' | 'card' | 'online';
  comment?: string;
}

export interface OrderFilters {
  status?: OrderStatus;
  startDate?: Date;
  endDate?: Date;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedOrders {
  orders: Order[];
  total: number;
  page: number;
  totalPages: number;
}

export class OrderService {
  private static instance: OrderService;
  private readonly COLLECTION = 'orders';

  private constructor() {}

  public static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  /**
   * Create new order
   */
  async createOrder(data: CreateOrderDto): Promise<Order> {
    try {
      // Validate items
      if (!data.items || data.items.length === 0) {
        throw new Error('Order must contain at least one item');
      }

      // Fetch and validate products
      const orderItems: OrderItem[] = [];
      let totalAmount = 0;

      for (const item of data.items) {
        const product = await productService.getProductById(item.productId);

        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }

        if (!product.isActive) {
          throw new Error(`Product ${product.name} is not available`);
        }

        const subtotal = product.price * item.quantity;
        totalAmount += subtotal;

        orderItems.push({
          productId: product.id,
          productName: product.name,
          quantity: item.quantity,
          price: product.price,
          subtotal
        });
      }

      // Generate order number
      const orderNumber = await this.generateOrderNumber();

      // Create order document
      const firestore = firebaseService.getFirestore();

      const orderData = {
        orderNumber,
        items: orderItems,
        totalAmount,
        customerInfo: data.customerInfo,
        paymentMethod: data.paymentMethod,
        status: 'pending' as OrderStatus,
        comment: data.comment || '',
        statusHistory: [
          {
            status: 'pending' as OrderStatus,
            timestamp: new Date(),
            note: 'Order created'
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await firestore.collection(this.COLLECTION).add(orderData);

      logger.info(`✅ Order created: ${orderNumber}`);

      return {
        id: docRef.id,
        ...orderData
      };
    } catch (error) {
      logger.error('❌ Create order error:', error);
      throw error;
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus(id: string, newStatus: OrderStatus, note?: string, updatedBy?: string): Promise<Order> {
    try {
      const firestore = firebaseService.getFirestore();
      const docRef = firestore.collection(this.COLLECTION).doc(id);

      const doc = await docRef.get();
      if (!doc.exists) {
        throw new Error('Order not found');
      }

      const orderData = doc.data() as any;

      // Validate status transition
      if (!this.validateStatusTransition(orderData.status, newStatus)) {
        throw new Error(`Invalid status transition from ${orderData.status} to ${newStatus}`);
      }

      // Create history entry
      const historyEntry: OrderHistoryEntry = {
        status: newStatus,
        timestamp: new Date(),
        note,
        updatedBy
      };

      // Update order
      await docRef.update({
        status: newStatus,
        statusHistory: [...orderData.statusHistory, historyEntry],
        updatedAt: new Date()
      });

      const updatedDoc = await docRef.get();
      const updatedData = updatedDoc.data();

      logger.info(`✅ Order status updated: ${id} -> ${newStatus}`);

      return {
        id: updatedDoc.id,
        ...updatedData,
        createdAt: updatedData?.createdAt?.toDate(),
        updatedAt: updatedData?.updatedAt?.toDate(),
        statusHistory: updatedData?.statusHistory.map((entry: any) => ({
          ...entry,
          timestamp: entry.timestamp?.toDate ? entry.timestamp.toDate() : entry.timestamp
        }))
      } as Order;
    } catch (error) {
      logger.error('❌ Update order status error:', error);
      throw error;
    }
  }

  /**
   * Get orders with pagination and filters
   */
  async getOrders(filters?: OrderFilters): Promise<PaginatedOrders> {
    try {
      const firestore = firebaseService.getFirestore();
      const page = filters?.page || 1;
      const limit = Math.min(filters?.limit || 20, 100);
      const offset = (page - 1) * limit;

      let query: any = firestore.collection(this.COLLECTION);

      // Apply filters
      if (filters?.status) {
        query = query.where('status', '==', filters.status);
      }

      if (filters?.startDate) {
        query = query.where('createdAt', '>=', filters.startDate);
      }

      if (filters?.endDate) {
        query = query.where('createdAt', '<=', filters.endDate);
      }

      // Get total count
      const countSnapshot = await query.get();
      const total = countSnapshot.size;

      // Apply pagination
      query = query.orderBy('createdAt', 'desc').limit(limit).offset(offset);

      const snapshot = await query.get();

      let orders = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        statusHistory: doc.data().statusHistory?.map((entry: any) => ({
          ...entry,
          timestamp: entry.timestamp?.toDate ? entry.timestamp.toDate() : entry.timestamp
        }))
      }));

      // Apply search filter (client-side)
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        orders = orders.filter((order: Order) =>
          order.orderNumber.toLowerCase().includes(searchLower) ||
          order.customerInfo.name.toLowerCase().includes(searchLower) ||
          order.customerInfo.phone.includes(searchLower)
        );
      }

      const totalPages = Math.ceil(total / limit);

      return {
        orders,
        total,
        page,
        totalPages
      };
    } catch (error) {
      logger.error('❌ Get orders error:', error);
      throw error;
    }
  }

  /**
   * Get order by ID
   */
  async getOrderById(id: string): Promise<Order | null> {
    try {
      const firestore = firebaseService.getFirestore();
      const doc = await firestore.collection(this.COLLECTION).doc(id).get();

      if (!doc.exists) {
        return null;
      }

      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data?.createdAt?.toDate(),
        updatedAt: data?.updatedAt?.toDate(),
        statusHistory: data?.statusHistory?.map((entry: any) => ({
          ...entry,
          timestamp: entry.timestamp?.toDate ? entry.timestamp.toDate() : entry.timestamp
        }))
      } as Order;
    } catch (error) {
      logger.error('❌ Get order by ID error:', error);
      throw error;
    }
  }

  /**
   * Cancel order
   */
  async cancelOrder(id: string, reason: string): Promise<Order> {
    return this.updateOrderStatus(id, 'cancelled', reason);
  }

  /**
   * Generate unique order number
   */
  private async generateOrderNumber(): Promise<string> {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD

    // Get count of orders today
    const firestore = firebaseService.getFirestore();
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

    const todayOrders = await firestore
      .collection(this.COLLECTION)
      .where('createdAt', '>=', startOfDay)
      .where('createdAt', '<', endOfDay)
      .get();

    const sequenceNumber = (todayOrders.size + 1).toString().padStart(4, '0');

    return `ORD-${dateStr}-${sequenceNumber}`;
  }

  /**
   * Validate status transition
   */
  private validateStatusTransition(current: OrderStatus, next: OrderStatus): boolean {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['preparing', 'cancelled'],
      'preparing': ['delivering', 'cancelled'],
      'delivering': ['completed', 'cancelled'],
      'completed': [],
      'cancelled': []
    };

    return validTransitions[current]?.includes(next) ?? false;
  }
}

export const orderService = OrderService.getInstance();
