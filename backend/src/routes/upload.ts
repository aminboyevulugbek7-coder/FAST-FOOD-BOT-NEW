import { Router, Request, Response } from 'express';
import multer from 'multer';
import { uploadService } from '../services/upload.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { logger } from '../utils/logger.util';

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

/**
 * POST /api/upload
 * Upload image file
 */
router.post(
  '/',
  authMiddleware,
  upload.single('image'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
        return;
      }

      const folder = req.body.folder || 'uploads';

      // Upload image
      const url = await uploadService.uploadImage(req.file, folder);

      res.status(200).json({
        success: true,
        url
      });
    } catch (error: any) {
      logger.error('❌ Upload route error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Upload failed'
      });
    }
  }
);

export default router;
