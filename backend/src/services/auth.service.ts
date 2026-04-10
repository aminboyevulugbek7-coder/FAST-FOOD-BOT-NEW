import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { firebaseService } from './firebase.service';
import { logger } from '../utils/logger.util';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
  createdAt: Date;
  lastLogin?: Date;
}

export interface AuthResult {
  success: boolean;
  token?: string;
  user?: AdminUser;
  message?: string;
}

export class AuthService {
  private static instance: AuthService;
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRES_IN = '24h';
  private readonly BCRYPT_ROUNDS = 12;

  private constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    if (!process.env.JWT_SECRET) {
      logger.warn('⚠️  JWT_SECRET not set in environment variables, using default (not secure for production)');
    }
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Admin login with email and password
   */
  async login(email: string, password: string): Promise<AuthResult> {
    try {
      // Validate inputs
      if (!email || !password) {
        return {
          success: false,
          message: 'Email and password are required'
        };
      }

      // Find admin by email
      const firestore = firebaseService.getFirestore();
      const adminsSnapshot = await firestore
        .collection('admins')
        .where('email', '==', email)
        .limit(1)
        .get();

      if (adminsSnapshot.empty) {
        return {
          success: false,
          message: 'Invalid credentials'
        };
      }

      const adminDoc = adminsSnapshot.docs[0];
      const adminData = adminDoc.data();

      // Verify password
      const isPasswordValid = await this.comparePassword(password, adminData.passwordHash);
      
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid credentials'
        };
      }

      // Update last login
      await firestore.collection('admins').doc(adminDoc.id).update({
        lastLogin: new Date()
      });

      // Generate JWT token
      const user: AdminUser = {
        id: adminDoc.id,
        email: adminData.email,
        name: adminData.name,
        role: adminData.role,
        createdAt: adminData.createdAt?.toDate() || new Date()
      };

      const token = this.generateToken(user);

      logger.info(`✅ Admin logged in: ${email}`);

      return {
        success: true,
        token,
        user
      };
    } catch (error) {
      logger.error('❌ Login error:', error);
      return {
        success: false,
        message: 'Login failed. Please try again.'
      };
    }
  }

  /**
   * Verify JWT token and return admin user
   */
  async verifyToken(token: string): Promise<AdminUser> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as any;
      
      return {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role,
        createdAt: new Date(decoded.createdAt)
      };
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Generate JWT token
   */
  private generateToken(user: AdminUser): string {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt
    };

    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN
    });
  }

  /**
   * Hash password using bcrypt
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.BCRYPT_ROUNDS);
  }

  /**
   * Compare password with hash
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Create initial admin user (for seeding)
   */
  async createAdmin(email: string, password: string, name: string, role: 'admin' | 'super_admin' = 'admin'): Promise<string> {
    try {
      const firestore = firebaseService.getFirestore();

      // Check if admin already exists
      const existingAdmin = await firestore
        .collection('admins')
        .where('email', '==', email)
        .limit(1)
        .get();

      if (!existingAdmin.empty) {
        throw new Error('Admin with this email already exists');
      }

      // Hash password
      const passwordHash = await this.hashPassword(password);

      // Create admin document
      const adminData = {
        email,
        passwordHash,
        name,
        role,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await firestore.collection('admins').add(adminData);
      
      logger.info(`✅ Admin created: ${email}`);
      
      return docRef.id;
    } catch (error) {
      logger.error('❌ Create admin error:', error);
      throw error;
    }
  }
}

export const authService = AuthService.getInstance();
