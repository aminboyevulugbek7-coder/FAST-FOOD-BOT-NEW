import { Scenes } from 'telegraf';
import { logger } from '../../utils/logger.util';

// Scene Session type
interface MySceneSession extends Scenes.SceneSessionData {
  phone?: string;
}

type MyContext = Scenes.SceneContext<MySceneSession>;

/**
 * Menu Scene
 * Mahsulotlar katalogini ko'rsatish
 */
export const menuScene = new Scenes.BaseScene<MyContext>('menu');

// Scene ga kirish
menuScene.enter(async (ctx) => {
  try {
    await ctx.reply(
      '🍔 Mahsulotlar katalogi:\n\n' +
      'Kategoriyalarni tanlang:',
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🍕 Pitsa', callback_data: 'category_pizza' }],
            [{ text: '🍔 Burger', callback_data: 'category_burger' }],
            [{ text: '🍟 Garnir', callback_data: 'category_sides' }],
            [{ text: '🥤 Ichimliklar', callback_data: 'category_drinks' }],
            [{ text: '🔙 Orqaga', callback_data: 'back_to_menu' }],
          ],
        },
      }
    );
  } catch (error) {
    logger.error('Menu scene enter xatosi:', error);
    await ctx.reply('❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
  }
});

// Kategoriya tanlash
menuScene.action(/category_(.+)/, async (ctx) => {
  try {
    const category = ctx.match[1];
    
    await ctx.answerCbQuery();
    await ctx.editMessageText(
      `📦 ${category.toUpperCase()} kategoriyasi:\n\n` +
      'Mahsulotlar tez orada qo\'shiladi...',
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔙 Kategoriyalarga qaytish', callback_data: 'back_to_categories' }],
          ],
        },
      }
    );
  } catch (error) {
    logger.error('Menu scene category xatosi:', error);
    await ctx.answerCbQuery('❌ Xatolik yuz berdi');
  }
});

// Kategoriyalarga qaytish
menuScene.action('back_to_categories', async (ctx) => {
  try {
    await ctx.answerCbQuery();
    await ctx.editMessageText(
      '🍔 Mahsulotlar katalogi:\n\n' +
      'Kategoriyalarni tanlang:',
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🍕 Pitsa', callback_data: 'category_pizza' }],
            [{ text: '🍔 Burger', callback_data: 'category_burger' }],
            [{ text: '🍟 Garnir', callback_data: 'category_sides' }],
            [{ text: '🥤 Ichimliklar', callback_data: 'category_drinks' }],
            [{ text: '🔙 Orqaga', callback_data: 'back_to_menu' }],
          ],
        },
      }
    );
  } catch (error) {
    logger.error('Menu scene back_to_categories xatosi:', error);
    await ctx.answerCbQuery('❌ Xatolik yuz berdi');
  }
});

// Asosiy menyuga qaytish
menuScene.action('back_to_menu', async (ctx) => {
  try {
    await ctx.answerCbQuery();
    await ctx.deleteMessage();
    await ctx.scene.leave();
  } catch (error) {
    logger.error('Menu scene back_to_menu xatosi:', error);
    await ctx.answerCbQuery('❌ Xatolik yuz berdi');
  }
});

// Scene dan chiqish
menuScene.leave(async (ctx) => {
  logger.info(`Foydalanuvchi menu scene dan chiqdi: ${ctx.from?.id}`);
});
