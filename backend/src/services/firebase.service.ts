import * as admin from 'firebase-admin';
import { firebaseConfig, validateFirebaseConfig } from '../config/firebase.config';
import { logger } from '../utils/logger.util';

/**
 * FirebaseService - Singleton pattern
 * Firebase Admin SDK bilan ishlash uchun yagona service
 */
export class FirebaseService {
  private static instance: FirebaseService;
  private db: admin.database.Database | null = null;
  private firestore: admin.firestore.Firestore | null = null;
  private storage: admin.storage.Storage | null = null;
  private isInitialized: boolean = false;

  private constructor() {
    try {
      // Firebase konfiguratsiyasini validatsiya qilish
      validateFirebaseConfig();

      // Firebase Admin SDK ni initialize qilish
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: firebaseConfig.projectId!,
          privateKey: firebaseConfig.privateKey!,
          clientEmail: firebaseConfig.clientEmail!,
        }),
        databaseURL: firebaseConfig.databaseURL,
      });

      this.db = admin.database();
      this.firestore = admin.firestore();
      this.storage = admin.storage();
      this.isInitialized = true;

      logger.info('✅ Firebase Admin SDK muvaffaqiyatli initialize qilindi');
    } catch (error) {
      logger.warn('⚠️  Firebase initialize xatosi, mock mode da ishlayapti:', error);
      this.isInitialized = false;
    }
  }

  /**
   * Singleton instance ni olish
   */
  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  /**
   * Firebase initialized ekanligini tekshirish
   */
  public isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Realtime Database reference ni olish
   */
  public getDatabase(): admin.database.Database {
    if (!this.db) {
      throw new Error('Firebase Database initialized emas');
    }
    return this.db;
  }

  /**
   * Firestore reference ni olish
   */
  public getFirestore(): admin.firestore.Firestore {
    if (!this.firestore) {
      throw new Error('Firebase Firestore initialized emas');
    }
    return this.firestore;
  }

  /**
   * Storage reference ni olish
   */
  public getStorage(): admin.storage.Storage {
    if (!this.storage) {
      throw new Error('Firebase Storage initialized emas');
    }
    return this.storage;
  }

  /**
   * Firestore collection ga ma'lumot qo'shish
   */
  async create<T>(collection: string, data: T): Promise<string> {
    if (!this.isInitialized) {
      throw new Error('Firebase initialized emas. Iltimos, Firebase ma\'lumotlarini .env fayliga qo\'shing.');
    }
    
    try {
      const docRef = await this.firestore!.collection(collection).add({
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      logger.info(`✅ ${collection} collection ga ma'lumot qo'shildi: ${docRef.id}`);
      return docRef.id;
    } catch (error) {
      logger.error(`❌ ${collection} collection ga ma'lumot qo'shish xatosi:`, error);
      throw error;
    }
  }

  /**
   * Firestore collection dan ma'lumot o'qish
   */
  async findById<T>(collection: string, id: string): Promise<T | null> {
    if (!this.isInitialized) {
      throw new Error('Firebase initialized emas. Iltimos, Firebase ma\'lumotlarini .env fayliga qo\'shing.');
    }
    
    try {
      const doc = await this.firestore!.collection(collection).doc(id).get();
      if (!doc.exists) {
        return null;
      }
      return { id: doc.id, ...doc.data() } as T;
    } catch (error) {
      logger.error(`❌ ${collection} collection dan ma'lumot o'qish xatosi:`, error);
      throw error;
    }
  }

  /**
   * Firestore collection dan barcha ma'lumotlarni o'qish
   */
  async findAll<T>(collection: string, filters?: { field: string; operator: admin.firestore.WhereFilterOp; value: any }[]): Promise<T[]> {
    if (!this.isInitialized) {
      throw new Error('Firebase initialized emas. Iltimos, Firebase ma\'lumotlarini .env fayliga qo\'shing.');
    }
    
    try {
      let query: admin.firestore.Query = this.firestore!.collection(collection);

      if (filters) {
        filters.forEach(filter => {
          query = query.where(filter.field, filter.operator, filter.value);
        });
      }

      const snapshot = await query.get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    } catch (error) {
      logger.error(`❌ ${collection} collection dan ma'lumotlar o'qish xatosi:`, error);
      throw error;
    }
  }

  /**
   * Firestore collection da ma'lumotni yangilash
   */
  async update<T>(collection: string, id: string, data: Partial<T>): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Firebase initialized emas. Iltimos, Firebase ma\'lumotlarini .env fayliga qo\'shing.');
    }
    
    try {
      await this.firestore!.collection(collection).doc(id).update({
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      logger.info(`✅ ${collection} collection da ma'lumot yangilandi: ${id}`);
    } catch (error) {
      logger.error(`❌ ${collection} collection da ma'lumot yangilash xatosi:`, error);
      throw error;
    }
  }

  /**
   * Firestore collection dan ma'lumotni o'chirish
   */
  async delete(collection: string, id: string): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Firebase initialized emas. Iltimos, Firebase ma\'lumotlarini .env fayliga qo\'shing.');
    }
    
    try {
      await this.firestore!.collection(collection).doc(id).delete();
      logger.info(`✅ ${collection} collection dan ma'lumot o'chirildi: ${id}`);
    } catch (error) {
      logger.error(`❌ ${collection} collection dan ma'lumot o'chirish xatosi:`, error);
      throw error;
    }
  }
}

// Singleton instance ni export qilish
export const firebaseService = FirebaseService.getInstance();
