import { Router, Request, Response } from 'express';
import { Order } from '../models/Order';

const router = Router();

// Create new order
router.post('/', async (req: Request, res: Response) => {
  try {
    const { items, totalAmount, customerInfo, paymentMethod, comment } = req.body;

    // Validate required fields
    if (!items || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Buyurtmalar bo\'sh bo\'lishi mumkin emas' 
      });
    }

    if (!customerInfo?.name || !customerInfo?.phone || !customerInfo?.address) {
      return res.status(400).json({ 
        success: false, 
        message: 'Iltimos, barcha ma\'lumotlarni kiriting' 
      });
    }

    // Create order
    const order = await Order.create({
      items,
      totalAmount,
      customerInfo,
      paymentMethod: paymentMethod || 'card',
      comment: comment || '',
      status: 'pending'
    });

    console.log('✅ New order created:', order._id);

    res.status(201).json({
      success: true,
      message: 'Buyurtma muvaffaqiyatli yaratildi',
      data: order
    });
  } catch (error: any) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Buyurtma yaratishda xatolik yuz berdi'
    });
  }
});

// Get all orders (for admin)
router.get('/', async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: orders
    });
  } catch (error: any) {
    console.error('❌ Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get order by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Buyurtma topilmadi'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error: any) {
    console.error('❌ Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update order status
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    
    const validStatuses = ['pending', 'confirmed', 'preparing', 'delivering', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri status'
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Buyurtma topilmadi'
      });
    }

    res.json({
      success: true,
      message: 'Status o\'zgartirildi',
      data: order
    });
  } catch (error: any) {
    console.error('❌ Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
