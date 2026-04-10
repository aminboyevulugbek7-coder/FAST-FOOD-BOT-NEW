import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Firebase konfiguratsiyasi
 * Environment variables orqali Firebase Admin SDK ni sozlash
 */
export const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
};

/**
 * Firebase konfiguratsiyasini validatsiya qilish
 * @throws Error agar kerakli environment variables mavjud bo'lmasa
 */
export function validateFirebaseConfig(): void {
  const requiredVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_DATABASE_URL',
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Firebase konfiguratsiyasi noto'g'ri: ${missingVars.join(', ')} environment variables mavjud emas`
    );
  }
}
