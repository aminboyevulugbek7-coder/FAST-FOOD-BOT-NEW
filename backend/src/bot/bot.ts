import { Telegraf, session, Scenes } from 'telegraf';
import dotenv from 'dotenv';
import { logger } from '../utils/logger.util';
import { usersService } from '../services/users.service';
import { registrationScene } from './scenes/registration.scene';
import { menuScene } from './scenes/menu.scene';

dotenv.config();

// Scene Context type
interface MySceneSession extends Scenes.SceneSessionData {
  phone?: string;
}

type MyContext = Scenes.SceneContext<MySceneSession>;

/**
 * Telegram Bot konfiguratsiyasi
 */
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN environment variable mavjud emas');
}

// Bot instance yaratish
export const bot = new Telegraf<MyContext>(BOT_TOKEN);

// Session va Scenes sozlash
const stage = new Scenes.Stage<MyContext>([
  registrationScene,
  menuScene,
]);

bot.use(session());
bot.use(stage.middleware());

/**
 * /start command handler
 * Foydalanuvchini tekshirish va Mini App ni ochish
 */
bot.command('start', async (ctx) => {
  try {
    const telegramId = ctx.from.id;
    const user = await usersService.findUserByTelegramId(telegramId);

    const miniAppUrl = process.env.MINI_APP_URL;

    if (!miniAppUrl || !miniAppUrl.startsWith('https://')) {
      // HTTPS URL yo'q - oddiy keyboard
      if (!user) {
        await ctx.reply(
          '👋 Assalomu alaykum! Fast Food Bagat botiga xush kelibsiz!\n\n' +
          'Buyurtma berish uchun ro\'yxatdan o\'ting.'
        );
        await (ctx as MyContext).scene.enter('registration');
      } else {
        await ctx.reply(
          `👋 Xush kelibsiz, ${user.firstName}!\n\n` +
          '🍔 Menyu - Mahsulotlar katalogi\n' +
          '🛒 Savat - Sizning savatingiz\n' +
          '📦 Buyurtmalar - Buyurtmalar tarixi\n' +
          '👤 Profil - Shaxsiy malumotlar',
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
      }
      return;
    }

    // HTTPS URL bor - Mini App tugmasi
    if (!user) {
      await ctx.reply(
        '👋 Assalomu alaykum! Fast Food Bagat botiga xush kelibsiz!\n\n' +
        '🍔 Buyurtma berish uchun quyidagi tugmani bosing:',
        {
          reply_markup: {
            inline_keyboard: [
              [{ 
                text: '🍔 Buyurtma berish', 
                web_app: { url: miniAppUrl }
              }],
            ],
          },
        }
      );
    } else {
      await ctx.reply(
        `👋 Xush kelibsiz, ${user.firstName}!\n\n` +
        '🍔 Buyurtma berish uchun quyidagi tugmani bosing:',
        {
          reply_markup: {
            inline_keyboard: [
              [{ 
                text: '🍔 Buyurtma berish', 
                web_app: { url: miniAppUrl }
              }],
            ],
          },
        }
      );
    }
  } catch (error) {
    logger.error('/start command xatosi:', error);
    await ctx.reply('❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
  }
});

/**
 * /profile command handler
 */
bot.command('profile', async (ctx) => {
  try {
    const telegramId = ctx.from.id;
    const user = await usersService.findUserByTelegramId(telegramId);

    if (!user) {
      await ctx.reply('❌ Siz ro\'yxatdan o\'tmagansiz. /start buyrug\'ini yuboring.');
      return;
    }

    await ctx.reply(
      `👤 Profil malumotlari:\n\n` +
      `Ism: ${user.firstName} ${user.lastName || ''}\n` +
      `Telefon: ${user.phone}\n` +
      `Royxatdan otgan: ${new Date(user.createdAt).toLocaleDateString('uz-UZ')}`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: '✏️ Tahrirlash', callback_data: 'edit_profile' }],
            [{ text: '🔙 Orqaga', callback_data: 'back_to_menu' }],
          ],
        },
      }
    );
  } catch (error) {
    logger.error('/profile command xatosi:', error);
    await ctx.reply('❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
  }
});

/**
 * Menyu tugmasi handler
 */
bot.hears('🍔 Menyu', async (ctx) => {
  try {
    await (ctx as MyContext).scene.enter('menu');
  } catch (error) {
    logger.error('Menyu tugmasi xatosi:', error);
    await ctx.reply('❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
  }
});

/**
 * Savat tugmasi handler
 */
bot.hears('🛒 Savat', async (ctx) => {
  try {
    await ctx.reply('🛒 Savat funksiyasi tez orada qo\'shiladi...');
  } catch (error) {
    logger.error('Savat tugmasi xatosi:', error);
    await ctx.reply('❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
  }
});

/**
 * Buyurtmalar tugmasi handler
 */
bot.hears('📦 Buyurtmalar', async (ctx) => {
  try {
    await ctx.reply('📦 Buyurtmalar funksiyasi tez orada qo\'shiladi...');
  } catch (error) {
    logger.error('Buyurtmalar tugmasi xatosi:', error);
    await ctx.reply('❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
  }
});

/**
 * Profil tugmasi handler
 */
bot.hears('👤 Profil', async (ctx) => {
  try {
    await ctx.replyWithHTML('/profile');
  } catch (error) {
    logger.error('Profil tugmasi xatosi:', error);
    await ctx.reply('❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
  }
});

/**
 * Global error handler
 */
bot.catch((err, ctx) => {
  logger.error('Bot global xatosi:', err);
  ctx.reply('❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
});

/**
 * Bot ni ishga tushirish
 */
export async function startBot() {
  try {
    await bot.launch();
    logger.info('✅ Telegram bot muvaffaqiyatli ishga tushdi');
    
    // Graceful shutdown
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
  } catch (error) {
    logger.error('❌ Bot ishga tushirishda xatolik:', error);
    throw error;
  }
}
