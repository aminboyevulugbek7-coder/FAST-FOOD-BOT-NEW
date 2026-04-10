import { firebaseService } from './firebase.service';
import { categoryService } from './category.service';
import { logger } from '../utils/logger.util';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  categoryName: string;
  isActive: boolean;
  inStock: boolean;
  stockQuantity?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  stockQuantity?: number;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
  isActive?: boolean;
  inStock?: boolean;
}

export interface ProductFilters {
  categoryId?: string;
  isActive?: boolean;
  inStock?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

export class ProductService {
  private static instance: ProductService;
  private readonly COLLECTION = 'products';

  private constructor() {}

  public static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  /**
   * Create new product
   */
  async createProduct(data: CreateProductDto): Promise<Product> {
    try {
      // Validate data
      this.validateProductData(data);

      // Validate category exists
      const category = await categoryService.getCategoryById(data.categoryId);
      if (!category) {
        throw new Error('Category not found');
      }

      const firestore = firebaseService.getFirestore();

      const productData = {
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrl: data.imageUrl,
        categoryId: data.categoryId,
        categoryName: category.name,
        isActive: true,
        inStock: true,
        stockQuantity: data.stockQuantity || 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await firestore.collection(this.COLLECTION).add(productData);

      // Update category product count
      await categoryService.updateProductCount(data.categoryId, 1);

      logger.info(`✅ Product created: ${docRef.id}`);

      return {
        id: docRef.id,
        ...productData
      };
    } catch (error) {
      logger.error('❌ Create product error:', error);
      throw error;
    }
  }

  /**
   * Update product
   */
  async updateProduct(id: string, data: UpdateProductDto): Promise<Product> {
    try {
      const firestore = firebaseService.getFirestore();
      const docRef = firestore.collection(this.COLLECTION).doc(id);

      const doc = await docRef.get();
      if (!doc.exists) {
        throw new Error('Product not found');
      }

      const currentData = doc.data();
      const updateData: any = { ...data, updatedAt: new Date() };

      // If category is being changed, validate and update category name
      if (data.categoryId && data.categoryId !== currentData?.categoryId) {
        const category = await categoryService.getCategoryById(data.categoryId);
        if (!category) {
          throw new Error('Category not found');
        }
        updateData.categoryName = category.name;

        // Update product counts
        await categoryService.updateProductCount(currentData?.categoryId, -1);
        await categoryService.updateProductCount(data.categoryId, 1);
      }

      await docRef.update(updateData);

      const updatedDoc = await docRef.get();
      const updatedData = updatedDoc.data();

      logger.info(`✅ Product updated: ${id}`);

      return {
        id: updatedDoc.id,
        ...updatedData
      } as Product;
    } catch (error) {
      logger.error('❌ Update product error:', error);
      throw error;
    }
  }

  /**
   * Delete product
   */
  async deleteProduct(id: string): Promise<void> {
    try {
      const firestore = firebaseService.getFirestore();
      const docRef = firestore.collection(this.COLLECTION).doc(id);

      const doc = await docRef.get();
      if (!doc.exists) {
        throw new Error('Product not found');
      }

      const productData = doc.data();
      await docRef.delete();

      // Update category product count
      if (productData?.categoryId) {
        await categoryService.updateProductCount(productData.categoryId, -1);
      }

      logger.info(`✅ Product deleted: ${id}`);
    } catch (error) {
      logger.error('❌ Delete product error:', error);
      throw error;
    }
  }

  /**
   * Get products with pagination and filters
   */
  async getProducts(filters?: ProductFilters): Promise<PaginatedProducts> {
    try {
      const firestore = firebaseService.getFirestore();
      const page = filters?.page || 1;
      const limit = Math.min(filters?.limit || 20, 100); // Max 100 items per page
      const offset = (page - 1) * limit;

      let query: any = firestore.collection(this.COLLECTION);

      // Apply filters
      if (filters?.categoryId) {
        query = query.where('categoryId', '==', filters.categoryId);
      }

      if (filters?.isActive !== undefined) {
        query = query.where('isActive', '==', filters.isActive);
      }

      if (filters?.inStock !== undefined) {
        query = query.where('inStock', '==', filters.inStock);
      }

      // Get total count
      const countSnapshot = await query.get();
      const total = countSnapshot.size;

      // Apply pagination
      query = query.orderBy('createdAt', 'desc').limit(limit).offset(offset);

      const snapshot = await query.get();

      let products = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      }));

      // Apply search filter (client-side)
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        products = products.filter((product: Product) =>
          product.name.toLowerCase().includes(searchLower)
        );
      }

      const totalPages = Math.ceil(total / limit);

      return {
        products,
        total,
        page,
        totalPages
      };
    } catch (error) {
      logger.error('❌ Get products error:', error);
      throw error;
    }
  }

  /**
   * Get product by ID
   */
  async getProductById(id: string): Promise<Product | null> {
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
      } as Product;
    } catch (error) {
      logger.error('❌ Get product by ID error:', error);
      throw error;
    }
  }

  /**
   * Update stock quantity
   */
  async updateStock(id: string, quantity: number): Promise<Product> {
    try {
      if (quantity < 0) {
        throw new Error('Stock quantity cannot be negative');
      }

      return this.updateProduct(id, {
        stockQuantity: quantity,
        inStock: quantity > 0
      });
    } catch (error) {
      logger.error('❌ Update stock error:', error);
      throw error;
    }
  }

  /**
   * Validate product data
   */
  private validateProductData(data: CreateProductDto): void {
    if (!data.name || data.name.length < 2 || data.name.length > 100) {
      throw new Error('Name must be between 2 and 100 characters');
    }

    if (!data.description || data.description.length < 10 || data.description.length > 1000) {
      throw new Error('Description must be between 10 and 1000 characters');
    }

    if (!data.price || data.price <= 0) {
      throw new Error('Price must be a positive number');
    }

    // Validate price has max 2 decimal places
    if (!/^\d+(\.\d{1,2})?$/.test(data.price.toString())) {
      throw new Error('Price can have maximum 2 decimal places');
    }

    if (!data.imageUrl) {
      throw new Error('Image URL is required');
    }

    if (!data.categoryId) {
      throw new Error('Category ID is required');
    }

    if (data.stockQuantity !== undefined && data.stockQuantity < 0) {
      throw new Error('Stock quantity cannot be negative');
    }
  }
}

export const productService = ProductService.getInstance();
