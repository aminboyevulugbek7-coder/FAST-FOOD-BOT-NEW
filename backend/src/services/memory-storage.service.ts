import { User } from '../entities/user.entity';
import { logger } from '../utils/logger.util';

/**
 * MemoryStorageService
 * Vaqtinchalik xotira (in-memory) storage - Firebase o'rniga
 */
export class MemoryStorageService {
  private static instance: MemoryStorageService;
  private users: Map<string, User> = new Map();
  private usersByTelegramId: Map<number, User> = new Map();

  private constructor() {
    logger.info('✅ Memory Storage initialized (Firebase o\'rniga)');
  }

  public static getInstance(): MemoryStorageService {
    if (!MemoryStorageService.instance) {
      MemoryStorageService.instance = new MemoryStorageService();
    }
    return MemoryStorageService.instance;
  }

  /**
   * Foydalanuvchi yaratish
   */
  async createUser(data: any): Promise<string> {
    const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const user: User = {
      id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.set(id, user);
    this.usersByTelegramId.set(data.telegramId, user);

    logger.info(`Memory Storage: Yangi foydalanuvchi yaratildi: ${id}`);
    return id;
  }

  /**
   * Telegram ID bo'yicha foydalanuvchini topish
   */
  async findUserByTelegramId(telegramId: number): Promise<User | null> {
    return this.usersByTelegramId.get(telegramId) || null;
  }

  /**
   * ID bo'yicha foydalanuvchini topish
   */
  async findUserById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  /**
   * Foydalanuvchini yangilash
   */
  async updateUser(id: string, data: any): Promise<void> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error('Foydalanuvchi topilmadi');
    }

    const updatedUser: User = {
      ...user,
      ...data,
      updatedAt: new Date(),
    };

    this.users.set(id, updatedUser);
    this.usersByTelegramId.set(updatedUser.telegramId, updatedUser);

    logger.info(`Memory Storage: Foydalanuvchi yangilandi: ${id}`);
  }

  /**
   * Barcha foydalanuvchilarni olish
   */
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
}

export const memoryStorage = MemoryStorageService.getInstance();
