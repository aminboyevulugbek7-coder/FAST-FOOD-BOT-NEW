import { firebaseService } from './firebase.service';
import { logger } from '../utils/logger.util';

export interface Banner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaLink?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBannerDto {
  title: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaLink?: string;
  order?: number;
}

export interface UpdateBannerDto extends Partial<CreateBannerDto> {
  isActive?: boolean;
}

export interface BannerFilters {
  isActive?: boolean;
  limit?: number;
}

export class BannerService {
  private static instance: BannerService;
  private readonly COLLECTION = 'banners';

  private constructor() {}

  public static getInstance(): BannerService {
    if (!BannerService.instance) {
      BannerService.instance = new BannerService();
    }
    return BannerService.instance;
  }

  /**
   * Create new banner
   */
  async createBanner(data: CreateBannerDto): Promise<Banner> {
    try {
      // Validate data
      this.validateBannerData(data);

      const firestore = firebaseService.getFirestore();

      // Get next order number if not provided
      const order = data.order || await this.getNextOrder();

      const bannerData = {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        ctaText: data.ctaText,
        ctaLink: data.ctaLink || '',
        isActive: true,
        order,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await firestore.collection(this.COLLECTION).add(bannerData);

      logger.info(`✅ Banner created: ${docRef.id}`);

      return {
        id: docRef.id,
        ...bannerData
      };
    } catch (error) {
      logger.error('❌ Create banner error:', error);
      throw error;
    }
  }

  /**
   * Update banner
   */
  async updateBanner(id: string, data: UpdateBannerDto): Promise<Banner> {
    try {
      const firestore = firebaseService.getFirestore();
      const docRef = firestore.collection(this.COLLECTION).doc(id);

      const doc = await docRef.get();
      if (!doc.exists) {
        throw new Error('Banner not found');
      }

      const updateData = {
        ...data,
        updatedAt: new Date()
      };

      await docRef.update(updateData);

      const updatedDoc = await docRef.get();
      const updatedData = updatedDoc.data();

      logger.info(`✅ Banner updated: ${id}`);

      return {
        id: updatedDoc.id,
        ...updatedData
      } as Banner;
    } catch (error) {
      logger.error('❌ Update banner error:', error);
      throw error;
    }
  }

  /**
   * Delete banner
   */
  async deleteBanner(id: string): Promise<void> {
    try {
      const firestore = firebaseService.getFirestore();
      await firestore.collection(this.COLLECTION).doc(id).delete();

      logger.info(`✅ Banner deleted: ${id}`);
    } catch (error) {
      logger.error('❌ Delete banner error:', error);
      throw error;
    }
  }

  /**
   * Get banners with filters
   */
  async getBanners(filters?: BannerFilters): Promise<Banner[]> {
    try {
      const firestore = firebaseService.getFirestore();
      let query: any = firestore.collection(this.COLLECTION);

      // Apply filters
      if (filters?.isActive !== undefined) {
        query = query.where('isActive', '==', filters.isActive);
      }

      // Order by order field
      query = query.orderBy('order', 'asc');

      // Apply limit
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const snapshot = await query.get();

      return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      }));
    } catch (error) {
      logger.error('❌ Get banners error:', error);
      throw error;
    }
  }

  /**
   * Get banner by ID
   */
  async getBannerById(id: string): Promise<Banner | null> {
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
        updatedAt: data?.updatedAt?.toDate()
      } as Banner;
    } catch (error) {
      logger.error('❌ Get banner by ID error:', error);
      throw error;
    }
  }

  /**
   * Toggle banner status
   */
  async toggleBannerStatus(id: string, isActive: boolean): Promise<Banner> {
    return this.updateBanner(id, { isActive });
  }

  /**
   * Validate banner data
   */
  private validateBannerData(data: CreateBannerDto): void {
    if (!data.title || data.title.length < 3 || data.title.length > 100) {
      throw new Error('Title must be between 3 and 100 characters');
    }

    if (!data.description || data.description.length < 10 || data.description.length > 500) {
      throw new Error('Description must be between 10 and 500 characters');
    }

    if (!data.imageUrl) {
      throw new Error('Image URL is required');
    }

    if (!data.ctaText || data.ctaText.length < 2 || data.ctaText.length > 50) {
      throw new Error('CTA text must be between 2 and 50 characters');
    }
  }

  /**
   * Get next order number
   */
  private async getNextOrder(): Promise<number> {
    try {
      const firestore = firebaseService.getFirestore();
      const snapshot = await firestore
        .collection(this.COLLECTION)
        .orderBy('order', 'desc')
        .limit(1)
        .get();

      if (snapshot.empty) {
        return 1;
      }

      const lastBanner = snapshot.docs[0].data();
      return (lastBanner.order || 0) + 1;
    } catch (error) {
      return 1;
    }
  }
}

export const bannerService = BannerService.getInstance();
