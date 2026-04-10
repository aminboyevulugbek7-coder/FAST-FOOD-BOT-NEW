import { firebaseService } from './firebase.service';
import { logger } from '../utils/logger.util';

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
  productCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryDto {
  name: string;
  description: string;
  imageUrl: string;
  order?: number;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {
  isActive?: boolean;
}

export interface CategoryFilters {
  isActive?: boolean;
  search?: string;
}

export class CategoryService {
  private static instance: CategoryService;
  private readonly COLLECTION = 'categories';

  private constructor() {}

  public static getInstance(): CategoryService {
    if (!CategoryService.instance) {
      CategoryService.instance = new CategoryService();
    }
    return CategoryService.instance;
  }

  /**
   * Create new category
   */
  async createCategory(data: CreateCategoryDto): Promise<Category> {
    try {
      // Validate data
      this.validateCategoryData(data);

      const firestore = firebaseService.getFirestore();

      // Check if category name already exists
      const existingCategory = await firestore
        .collection(this.COLLECTION)
        .where('name', '==', data.name)
        .limit(1)
        .get();

      if (!existingCategory.empty) {
        throw new Error('Category with this name already exists');
      }

      // Get next order number if not provided
      const order = data.order || await this.getNextOrder();

      const categoryData = {
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        order,
        isActive: true,
        productCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await firestore.collection(this.COLLECTION).add(categoryData);

      logger.info(`✅ Category created: ${docRef.id}`);

      return {
        id: docRef.id,
        ...categoryData
      };
    } catch (error) {
      logger.error('❌ Create category error:', error);
      throw error;
    }
  }

  /**
   * Update category
   */
  async updateCategory(id: string, data: UpdateCategoryDto): Promise<Category> {
    try {
      const firestore = firebaseService.getFirestore();
      const docRef = firestore.collection(this.COLLECTION).doc(id);

      const doc = await docRef.get();
      if (!doc.exists) {
        throw new Error('Category not found');
      }

      // If updating name, check uniqueness
      if (data.name) {
        const existingCategory = await firestore
          .collection(this.COLLECTION)
          .where('name', '==', data.name)
          .limit(1)
          .get();

        if (!existingCategory.empty && existingCategory.docs[0].id !== id) {
          throw new Error('Category with this name already exists');
        }
      }

      const updateData = {
        ...data,
        updatedAt: new Date()
      };

      await docRef.update(updateData);

      const updatedDoc = await docRef.get();
      const updatedData = updatedDoc.data();

      logger.info(`✅ Category updated: ${id}`);

      return {
        id: updatedDoc.id,
        ...updatedData
      } as Category;
    } catch (error) {
      logger.error('❌ Update category error:', error);
      throw error;
    }
  }

  /**
   * Delete category (only if productCount is 0)
   */
  async deleteCategory(id: string): Promise<void> {
    try {
      const firestore = firebaseService.getFirestore();
      const docRef = firestore.collection(this.COLLECTION).doc(id);

      const doc = await docRef.get();
      if (!doc.exists) {
        throw new Error('Category not found');
      }

      const categoryData = doc.data();
      if (categoryData?.productCount > 0) {
        throw new Error('Cannot delete category with products. Please reassign or delete products first.');
      }

      await docRef.delete();

      logger.info(`✅ Category deleted: ${id}`);
    } catch (error) {
      logger.error('❌ Delete category error:', error);
      throw error;
    }
  }

  /**
   * Get categories with filters
   */
  async getCategories(filters?: CategoryFilters): Promise<Category[]> {
    try {
      const firestore = firebaseService.getFirestore();
      let query: any = firestore.collection(this.COLLECTION);

      // Apply filters
      if (filters?.isActive !== undefined) {
        query = query.where('isActive', '==', filters.isActive);
      }

      // Order by order field
      query = query.orderBy('order', 'asc');

      const snapshot = await query.get();

      let categories = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      }));

      // Apply search filter (client-side since Firestore doesn't support text search)
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        categories = categories.filter((cat: Category) =>
          cat.name.toLowerCase().includes(searchLower)
        );
      }

      return categories;
    } catch (error) {
      logger.error('❌ Get categories error:', error);
      throw error;
    }
  }

  /**
   * Get category by ID
   */
  async getCategoryById(id: string): Promise<Category | null> {
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
      } as Category;
    } catch (error) {
      logger.error('❌ Get category by ID error:', error);
      throw error;
    }
  }

  /**
   * Reorder categories
   */
  async reorderCategories(orders: Array<{ id: string; order: number }>): Promise<void> {
    try {
      const firestore = firebaseService.getFirestore();
      const batch = firestore.batch();

      for (const item of orders) {
        const docRef = firestore.collection(this.COLLECTION).doc(item.id);
        batch.update(docRef, { order: item.order, updatedAt: new Date() });
      }

      await batch.commit();

      logger.info(`✅ Categories reordered`);
    } catch (error) {
      logger.error('❌ Reorder categories error:', error);
      throw error;
    }
  }

  /**
   * Update product count for a category
   */
  async updateProductCount(categoryId: string, increment: number): Promise<void> {
    try {
      const firestore = firebaseService.getFirestore();
      const docRef = firestore.collection(this.COLLECTION).doc(categoryId);

      const doc = await docRef.get();
      if (!doc.exists) {
        throw new Error('Category not found');
      }

      const currentCount = doc.data()?.productCount || 0;
      const newCount = Math.max(0, currentCount + increment);

      await docRef.update({
        productCount: newCount,
        updatedAt: new Date()
      });

      logger.info(`✅ Category product count updated: ${categoryId} (${newCount})`);
    } catch (error) {
      logger.error('❌ Update product count error:', error);
      throw error;
    }
  }

  /**
   * Validate category data
   */
  private validateCategoryData(data: CreateCategoryDto): void {
    if (!data.name || data.name.length < 2 || data.name.length > 50) {
      throw new Error('Name must be between 2 and 50 characters');
    }

    if (!data.description || data.description.length < 10 || data.description.length > 500) {
      throw new Error('Description must be between 10 and 500 characters');
    }

    if (!data.imageUrl) {
      throw new Error('Image URL is required');
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

      const lastCategory = snapshot.docs[0].data();
      return (lastCategory.order || 0) + 1;
    } catch (error) {
      return 1;
    }
  }
}

export const categoryService = CategoryService.getInstance();
