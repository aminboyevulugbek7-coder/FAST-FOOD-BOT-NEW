import { firebaseService } from './firebase.service';
import { logger } from '../utils/logger.util';
import * as crypto from 'crypto';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export class UploadService {
  private static instance: UploadService;
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  private readonly MAX_SIZE = 5 * 1024 * 1024; // 5MB

  private constructor() {}

  public static getInstance(): UploadService {
    if (!UploadService.instance) {
      UploadService.instance = new UploadService();
    }
    return UploadService.instance;
  }

  /**
   * Upload image to Firebase Storage
   */
  async uploadImage(file: Express.Multer.File, folder: string): Promise<string> {
    try {
      // Validate image
      const validation = this.validateImage(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Generate unique filename
      const filename = this.generateFilename(file.originalname);
      const storagePath = `${folder}/${filename}`;

      // Get storage bucket
      const storage = firebaseService.getStorage();
      const bucket = storage.bucket();
      const fileRef = bucket.file(storagePath);

      // Upload file
      await fileRef.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
          metadata: {
            uploadedAt: new Date().toISOString()
          }
        }
      });

      // Make file publicly accessible
      await fileRef.makePublic();

      // Get public URL
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;

      logger.info(`✅ Image uploaded: ${publicUrl}`);

      return publicUrl;
    } catch (error) {
      logger.error('❌ Upload image error:', error);
      throw error;
    }
  }

  /**
   * Delete image from Firebase Storage
   */
  async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extract file path from URL
      const urlParts = imageUrl.split('/');
      const bucketName = urlParts[3];
      const filePath = urlParts.slice(4).join('/');

      // Get storage bucket
      const storage = firebaseService.getStorage();
      const bucket = storage.bucket(bucketName);
      const fileRef = bucket.file(filePath);

      // Delete file
      await fileRef.delete();

      logger.info(`✅ Image deleted: ${imageUrl}`);
    } catch (error) {
      logger.error('❌ Delete image error:', error);
      throw error;
    }
  }

  /**
   * Validate image file
   */
  validateImage(file: Express.Multer.File): ValidationResult {
    // Check file type
    if (!this.ALLOWED_TYPES.includes(file.mimetype)) {
      return {
        valid: false,
        error: 'Invalid file type. Only JPG, PNG, and WebP are allowed.'
      };
    }

    // Check file size
    if (file.size > this.MAX_SIZE) {
      return {
        valid: false,
        error: 'File size exceeds 5MB limit.'
      };
    }

    return { valid: true };
  }

  /**
   * Generate unique filename
   */
  private generateFilename(originalName: string): string {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    const extension = originalName.split('.').pop();
    return `${timestamp}-${randomString}.${extension}`;
  }
}

export const uploadService = UploadService.getInstance();
