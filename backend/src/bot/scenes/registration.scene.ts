import { Scenes } from 'telegraf';
import { usersService } from '../../services/users.service';
import { logger } from '../../utils/logger.util';

// Scene Session type
interface MySceneSession extends Scenes.SceneSessionData {
  phone?: string;
}

type MyContext = Scenes.SceneContext<MySceneSession>;

/**
 * Registration Scene
 * Yangi foydalanuvchilarni ro'yxatdan o'tkazish
 */
export const registrationScene = new Scenes.BaseScene<MyContext>('registration');

// Scene ga kirish
registrationScene.enter(async (ctx) => {
  try {
    await ctx.reply(
      '📱 Iltimos, telefon raqamingizni ulashing:',
      {
        reply_markup: {
          keyboard: [
            [{ text: '📱 Telefon raqamni ulashish', request_contact: true }],
          ],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      }
    );
  } catch (error) {
    logger.error('Registration scene enter xatosi:', error);
    await ctx.reply('❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
  }
});

// Telefon raqam qabul qilish
registrationScene.on('contact', async (ctx) => {
  try {
    const contact = ctx.message.contact;
    
    if (!contact || contact.user_id !== ctx.from.id) {
      await ctx.reply('❌ Iltimos, o\'z telefon raqamingizni ulashing.');
      return;
    }

    // Telefon raqamni saqlash
    ctx.scene.session.phone = contact.phone_number;

    await ctx.reply(
      '✅ Telefon raqam qabul qilindi!\n\n' +
      '👤 Endi ismingizni kiriting:',
      {
        reply_markup: {
          remove_keyboard: true,
        },
      }
    );
  } catch (error) {
    logger.error('Registration scene contact xatosi:', error);
    await ctx.reply('❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
  }
});

// Ism qabul qilish
registrationScene.on('text', async (ctx) => {
  try {
    const firstName = ctx.message.text.trim();
    
    if (firstName.length < 2) {
      await ctx.reply('❌ Ism kamida 2 ta belgidan iborat bo\'lishi kerak.');
      return;
    }

    const phone = ctx.scene.session.phone;
    
    if (!phone) {
      await ctx.reply('❌ Telefon raqam topilmadi. Iltimos, qaytadan boshlang: /start');
      await ctx.scene.leave();
      return;
    }

    // Foydalanuvchini yaratish
    const telegramId = ctx.from.id;
    await usersService.createUser({
      telegramId,
      firstName,
      phone: phone.startsWith('+') ? phone : `+${phone}`,
    });

    await ctx.reply(
      `✅ Ro'yxatdan o'tish muvaffaqiyatli yakunlandi!\n\n` +
      `Xush kelibsiz, ${firstName}! 🎉`,
      {
        reply_markup: {
          keyboard: [
            [{ text: '🍔 Menyu' }, { text: '🛒 Savat' }],
            [{ text: '📦 Buyurtmalar' }, { text: '👤 Profil' }],
          ],
          resize_keyboard: true,
        },
      }
    );

    await ctx.scene.leave();
  } catch (error) {
    logger.error('Registration scene text xatosi:', error);
    await ctx.reply('❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring: /start');
    await ctx.scene.leave();
  }
});

// Scene dan chiqish
registrationScene.leave(async (ctx) => {
  logger.info(`Foydalanuvchi ro'yxatdan o'tdi: ${ctx.from?.id}`);
});
