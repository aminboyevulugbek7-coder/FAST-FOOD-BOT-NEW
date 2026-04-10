import dotenv from 'dotenv';
import { authService } from '../services/auth.service';
import { logger } from '../utils/logger.util';

dotenv.config();

/**
 * Seed script to create initial admin user
 * Usage: ts-node src/scripts/seed-admin.ts
 */
async function seedAdmin() {
  try {
    logger.info('🌱 Starting admin seed...');

    const email = process.env.ADMIN_EMAIL || 'admin@fastfood.com';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const name = process.env.ADMIN_NAME || 'Admin User';
    const role = 'super_admin';

    const adminId = await authService.createAdmin(email, password, name, role);

    logger.info(`✅ Admin user created successfully!`);
    logger.info(`   ID: ${adminId}`);
    logger.info(`   Email: ${email}`);
    logger.info(`   Password: ${password}`);
    logger.info(`   Role: ${role}`);
    logger.info('');
    logger.info('⚠️  Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    logger.error('❌ Seed admin failed:', error);
    process.exit(1);
  }
}

seedAdmin();
