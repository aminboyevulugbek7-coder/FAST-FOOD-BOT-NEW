import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import orderRoutes from './routes/orders';
import productRoutes from './routes/products';
import { startBot } from './bot/bot';
import { logger } from './utils/logger.util';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Express error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Database connection and server start
const startServer = async () => {
  try {
    // Connect to MongoDB (optional)
    if (process.env.MONGODB_URI) {
      try {
        await mongoose.connect(process.env.MONGODB_URI);
        logger.info('✅ MongoDB connected successfully');
      } catch (dbError) {
        logger.warn('⚠️  MongoDB connection failed, running in mock mode');
      }
    } else {
      logger.warn('⚠️  MONGODB_URI not provided, using mock data');
    }

    // Start Express server
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📱 Environment: ${process.env.NODE_ENV}`);
      logger.info(`💡 API available at http://localhost:${PORT}/api`);
    });

    // Start Telegram Bot
    await startBot();
    logger.info('✅ Telegram bot ishga tushdi');
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
