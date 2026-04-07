import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customerInfo: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    telegramId: Number,
    username: String
  },
  items: [{
    id: Number,
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  totalAmount: { type: Number, required: true },
  paymentMethod: { 
    type: String, 
    enum: ['card', 'cash'],
    default: 'card'
  },
  comment: String,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'delivering', 'delivered', 'cancelled'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

export const Order = mongoose.model('Order', orderSchema);
