import { firebaseService } from '../services/firebase.service';
import { memoryStorage } from '../services/memory-storage.service';
import { User, CreateUserData, UpdateUserData } from '../entities/user.entity';
import { logger } from '../utils/logger.util';

/**
 * UsersRepository
 * Firebase yoki Memory Storage bilan foydalanuvchilar ma'lumotlarini boshqarish
 */
export class UsersRepository {
  private readonly collection = 'users';
  private useFirebase: boolean;

  constructor() {
    this.useFirebase = firebaseService.isReady();
    if (!this.useFirebase) {
      logger.info('UsersRepository: Memory Storage ishlatilmoqda (Firebase o\'rniga)');
    }
  }

  /**
   * Telegram ID bo'yicha foydalanuvchini topish
   */
  async findByTelegramId(telegramId: number): Promise<User | null> {
    try {
      if (this.useFirebase) {
        const users = await firebaseService.findAll<User>(this.collection, [
          { field: 'telegramId', operator: '==', value: telegramId }
        ]);
        return users.length > 0 ? users[0] : null;
      } else {
        return await memoryStorage.findUserByTelegramId(telegramId);
      }
    } catch (error) {
      logger.error('UsersRepository.findByTelegramId xatosi:', error);
      throw error;
    }
  }

  /**
   * ID bo'yicha foydalanuvchini topish
   */
  async findById(id: string): Promise<User | null> {
    try {
      if (this.useFirebase) {
        return await firebaseService.findById<User>(this.collection, id);
      } else {
        return await memoryStorage.findUserById(id);
      }
    } catch (error) {
      logger.error('UsersRepository.findById xatosi:', error);
      throw error;
    }
  }

  /**
   * Yangi foydalanuvchi yaratish
   */
  async create(data: CreateUserData): Promise<string> {
    try {
      const userData = {
        ...data,
        isAdmin: data.isAdmin || false,
      };

      if (this.useFirebase) {
        const id = await firebaseService.create(this.collection, userData);
        logger.info(`Yangi foydalanuvchi yaratildi: ${id} (Telegram ID: ${data.telegramId})`);
        return id;
      } else {
        return await memoryStorage.createUser(userData);
      }
    } catch (error) {
      logger.error('UsersRepository.create xatosi:', error);
      throw error;
    }
  }

  /**
   * Foydalanuvchi ma'lumotlarini yangilash
   */
  async update(id: string, data: UpdateUserData): Promise<void> {
    try {
      if (this.useFirebase) {
        await firebaseService.update(this.collection, id, data);
        logger.info(`Foydalanuvchi yangilandi: ${id}`);
      } else {
        await memoryStorage.updateUser(id, data);
      }
    } catch (error) {
      logger.error('UsersRepository.update xatosi:', error);
      throw error;
    }
  }

  /**
   * Barcha adminlarni olish
   */
  async findAdmins(): Promise<User[]> {
    try {
      if (this.useFirebase) {
        return await firebaseService.findAll<User>(this.collection, [
          { field: 'isAdmin', operator: '==', value: true }
        ]);
      } else {
        const allUsers = await memoryStorage.getAllUsers();
        return allUsers.filter(user => user.isAdmin);
      }
    } catch (error) {
      logger.error('UsersRepository.findAdmins xatosi:', error);
      throw error;
    }
  }
}

export const usersRepository = new UsersRepository();
