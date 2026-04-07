# Telegram Mini App Sozlash Qo'llanmasi

## 1. Mini App nima?

Telegram Mini App - bu Telegram bot ichida ochiluvchi web ilovalar. Foydalanuvchilar botdan chiqmasdan to'liq funksional web ilovadan foydalanishlari mumkin.

## 2. Hozirgi holat

✅ **Backend** - Port 5001 da ishlab turibdi
✅ **Frontend** - Port 5173 da ishlab turibdi  
✅ **Bot** - Telegram da ishlayapti
✅ **Mini App tugmasi** - Botga qo'shildi

## 3. Local test qilish

### Botni sinab ko'rish:

1. Telegram da botingizni oching
2. `/start` buyrug'ini yuboring
3. "🍔 Buyurtma berish" tugmasini bosing
4. Mini App ochiladi (local URL)

**Muhim:** Telegram Mini App faqat HTTPS URL larni qo'llab-quvvatlaydi. Local test uchun Telegram Desktop yoki Telegram Web ishlatishingiz kerak.

## 4. Production uchun sozlash

### 4.1. Frontend ni deploy qilish

Frontend ni quyidagi platformalarga deploy qilishingiz mumkin:

**Vercel (Tavsiya etiladi):**
```bash
cd frontend
npm install -g vercel
vercel
```

**Netlify:**
```bash
cd frontend
npm run build
# dist papkasini Netlify ga upload qiling
```

**GitHub Pages:**
```bash
cd frontend
npm run build
# dist papkasini GitHub Pages ga deploy qiling
```

### 4.2. Backend ni deploy qilish

Backend ni quyidagi platformalarga deploy qilishingiz mumkin:

**Heroku:**
```bash
cd backend
heroku create fastfood-bagat-backend
git push heroku main
```

**Railway:**
```bash
cd backend
railway init
railway up
```

**DigitalOcean / AWS / Azure:**
- VPS yarating
- Node.js o'rnating
- Backend kodini upload qiling
- PM2 bilan ishga tushiring

### 4.3. Mini App URL ni yangilash

Frontend deploy qilingandan keyin:

1. `.env` faylini oching
2. `MINI_APP_URL` ni yangilang:

```env
MINI_APP_URL=https://your-frontend-domain.vercel.app
```

3. Backend ni qayta ishga tushiring

### 4.4. BotFather da Mini App ni sozlash

1. [@BotFather](https://t.me/BotFather) ga o'ting
2. `/mybots` buyrug'ini yuboring
3. Botingizni tanlang
4. "Bot Settings" → "Menu Button" → "Configure menu button"
5. Mini App URL ni kiriting: `https://your-frontend-domain.vercel.app`

## 5. Ngrok bilan local test (HTTPS)

Agar local da HTTPS bilan test qilmoqchi bo'lsangiz:

### 5.1. Ngrok o'rnatish

```bash
# Windows
choco install ngrok

# yoki https://ngrok.com/download dan yuklab oling
```

### 5.2. Ngrok ishga tushirish

```bash
ngrok http 5173
```

### 5.3. URL ni olish

Ngrok sizga HTTPS URL beradi, masalan:
```
https://abc123.ngrok.io
```

### 5.4. .env ni yangilash

```env
MINI_APP_URL=https://abc123.ngrok.io
```

### 5.5. Backend ni qayta ishga tushirish

```bash
cd backend
npm run dev
```

## 6. Mini App funksiyalari

Sizning frontend ilovangiz quyidagi funksiyalarni qo'llab-quvvatlaydi:

- ✅ Mahsulotlar katalogi
- ✅ Savat boshqaruvi
- ✅ Buyurtma berish
- ✅ Buyurtmalar tarixi
- ✅ Profil boshqaruvi
- ✅ Telegram SDK integratsiyasi

## 7. Telegram SDK funksiyalari

Frontend da `@telegram-apps/sdk` ishlatilgan. Bu quyidagi imkoniyatlarni beradi:

- Telegram foydalanuvchi ma'lumotlarini olish
- Telegram tema ranglarini ishlatish
- Telegram to'lov tizimini ishlatish
- Telegram bildirishnomalarini yuborish
- Va boshqalar

## 8. Muammolarni hal qilish

### Mini App ochilmayapti:

1. URL HTTPS ekanligini tekshiring
2. Frontend server ishlab turganligini tekshiring
3. CORS sozlamalarini tekshiring

### Bot javob bermayapti:

1. Backend server ishlab turganligini tekshiring
2. Bot token to'g'ri ekanligini tekshiring
3. `.env` faylida `MINI_APP_URL` to'g'ri ekanligini tekshiring

### Frontend xatolari:

1. `npm run dev` ishlab turganligini tekshiring
2. Browser console da xatolarni tekshiring
3. Network tab da API so'rovlarni tekshiring

## 9. Keyingi qadamlar

- ✅ Frontend ni production ga deploy qilish
- ✅ Backend ni production ga deploy qilish
- ✅ Firebase sozlash (optional)
- ✅ To'lov tizimini qo'shish
- ✅ Push bildirishnomalar
- ✅ Analytics qo'shish

## Yordam

Agar savollar bo'lsa:
- [Telegram Mini Apps Documentation](https://core.telegram.org/bots/webapps)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Telegraf Documentation](https://telegraf.js.org/)
