/**
 * User Entity
 * Foydalanuvchi ma'lumotlari strukturasi
 */
export interface User {
  id: string;
  telegramId: number;
  firstName: string;
  lastName?: string;
  phone: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User yaratish uchun ma'lumotlar
 */
export interface CreateUserData {
  telegramId: number;
  firstName: string;
  lastName?: string;
  phone: string;
  isAdmin?: boolean;
}

/**
 * User yangilash uchun ma'lumotlar
 */
export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  phone?: string;
}
