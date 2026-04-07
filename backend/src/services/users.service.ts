import { usersRepository } from '../repositories/users.repository';
import { User, CreateUserData, UpdateUserData } from '../entities/user.entity';
import { logger } from '../utils/logger.util';
import { validate } from 'class-validator';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { plainToClass } from 'class-transformer';

/**
 * UsersService
 * Foydalanuvchilar bilan ishlash uchun biznes logika
 */
export class UsersService {
  /**
   * Yangi foydalanuvchi yaratish
   */
  async createUser(data: CreateUserData): Promise<string> {
    try {
      // DTO validatsiya
      const dto = plainToClass(CreateUserDto, data);
      const errors = await validate(dto);
      
      if (errors.length > 0) {
        const errorMessages = errors.map(err => Object.values(err.constraints || {}).join(', ')).join('; ');
        throw new Error(`Validatsiya xatosi: ${errorMessages}`);
      }

      // Foydalanuvchi allaqachon mavjudligini tekshirish
      const existingUser = await usersRepository.findByTelegramId(data.telegramId);
      if (existingUser) {
        throw new Error('Bu Telegram ID bilan foydalanuvchi allaqachon ro\'yxatdan o\'tgan');
      }

      // Yangi foydalanuvchi yaratish
      const userId = await usersRepository.create(data);
      logger.info(`Yangi foydalanuvchi yaratildi: ${userId}`);
      return userId;
    } catch (error) {
      logger.error('UsersService.createUser xatosi:', error);
      throw error;
    }
  }

  /**
   * Telegram ID bo'yicha foydalanuvchini topish
   */
  async findUserByTelegramId(telegramId: number): Promise<User | null> {
    try {
      return await usersRepository.findByTelegramId(telegramId);
    } catch (error) {
      logger.error('UsersService.findUserByTelegramId xatosi:', error);
      throw error;
    }
  }

  /**
   * ID bo'yicha foydalanuvchini topish
   */
  async findUserById(userId: string): Promise<User | null> {
    try {
      return await usersRepository.findById(userId);
    } catch (error) {
      logger.error('UsersService.findUserById xatosi:', error);
      throw error;
    }
  }

  /**
   * Foydalanuvchi ma'lumotlarini yangilash
   */
  async updateUser(userId: string, data: UpdateUserData): Promise<void> {
    try {
      // DTO validatsiya
      const dto = plainToClass(UpdateUserDto, data);
      const errors = await validate(dto);
      
      if (errors.length > 0) {
        const errorMessages = errors.map(err => Object.values(err.constraints || {}).join(', ')).join('; ');
        throw new Error(`Validatsiya xatosi: ${errorMessages}`);
      }

      // Foydalanuvchi mavjudligini tekshirish
      const user = await usersRepository.findById(userId);
      if (!user) {
        throw new Error('Foydalanuvchi topilmadi');
      }

      // Ma'lumotlarni yangilash
      await usersRepository.update(userId, data);
      logger.info(`Foydalanuvchi yangilandi: ${userId}`);
    } catch (error) {
      logger.error('UsersService.updateUser xatosi:', error);
      throw error;
    }
  }

  /**
   * Foydalanuvchi admin ekanligini tekshirish
   */
  async isAdmin(telegramId: number): Promise<boolean> {
    try {
      const user = await usersRepository.findByTelegramId(telegramId);
      return user?.isAdmin || false;
    } catch (error) {
      logger.error('UsersService.isAdmin xatosi:', error);
      return false;
    }
  }

  /**
   * Foydalanuvchini ro'yxatdan o'tkazish yoki topish
   */
  async getOrCreateUser(telegramId: number, firstName: string, phone: string): Promise<User> {
    try {
      // Mavjud foydalanuvchini topish
      let user = await usersRepository.findByTelegramId(telegramId);
      
      if (!user) {
        // Yangi foydalanuvchi yaratish
        const userId = await this.createUser({
          telegramId,
          firstName,
          phone,
        });
        user = await usersRepository.findById(userId);
      }

      if (!user) {
        throw new Error('Foydalanuvchini yaratib bo\'lmadi');
      }

      return user;
    } catch (error) {
      logger.error('UsersService.getOrCreateUser xatosi:', error);
      throw error;
    }
  }
}

export const usersService = new UsersService();
