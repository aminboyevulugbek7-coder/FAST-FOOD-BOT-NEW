# Fast Food Bagat - Telegram Bot Backend

## Loyiha haqida

Fast Food Bagat uchun Telegram bot backend tizimi. Express.js, Telegraf va Firebase Admin SDK yordamida qurilgan.

## Xususiyatlar

- ✅ Telegram bot integratsiyasi (Telegraf)
- ✅ Firebase Firestore ma'lumotlar bazasi
- ✅ Foydalanuvchi ro'yxatdan o'tish
- ✅ Mahsulotlar katalogi
- ✅ Savat boshqaruvi
- ✅ Buyurtmalar tizimi
- ✅ Admin panel
- ✅ Winston logger
- ✅ TypeScript

## O'rnatish

### 1. Dependencies o'rnatish

```bash
npm install
```

### 2. Environment variables sozlash

`.env` faylini yarating va quyidagi ma'lumotlarni kiriting:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB (optional)
MONGODB_URI=mongodb://localhost:27017/fastfood-telegram

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Telegram Bot
TELEGRAM_BOT_TOKEN=your-telegram-bot-token-here
TELEGRAM_ADMIN_IDS=123456789,987654321

# Firebase
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
```

### 3. Telegram Bot yaratish

1. [@BotFather](https://t.me/BotFather) ga o'ting
2. `/newbot` buyrug'ini yuboring
3. Bot nomini va username ni kiriting
4. Bot tokenni oling va `.env` fayliga qo'shing

### 4. Firebase sozlash

1. [Firebase Console](https://console.firebase.google.com/) ga o'ting
2. Yangi loyiha yarating
3. Firestore Database ni yoqing
4. Service Account kalitini yuklab oling
5. Kalitdagi ma'lumotlarni `.env` fayliga qo'shing

## Ishga tushirish

### Development mode

```bash
npm run dev
```

### Production mode

```bash
npm run build
npm start
```

## Bot buyruqlari

- `/start` - Botni ishga tushirish va ro'yxatdan o'tish
- `/profile` - Profil ma'lumotlarini ko'rish
- `/cart` - Savatni ko'rish
- `/orders` - Buyurtmalar tarixini ko'rish
- `/admin` - Admin panel (faqat adminlar uchun)

## Loyiha strukturasi

```
backend/
├── src/
│   ├── bot/                    # Telegram bot
│   │   ├── scenes/            # Bot scenes
│   │   └── bot.ts             # Bot konfiguratsiyasi
│   ├── config/                # Konfiguratsiya fayllari
│   ├── dto/                   # Data Transfer Objects
│   ├── entities/              # Entity interfeyslari
│   ├── repositories/          # Ma'lumotlar bazasi repositories
│   ├── services/              # Biznes logika
│   ├── utils/                 # Utility funksiyalar
│   └── server.ts              # Express server
├── logs/                      # Log fayllari
├── .env                       # Environment variables
└── package.json
```

## Texnologiyalar

- **Express.js** - Web framework
- **Telegraf** - Telegram Bot framework
- **Firebase Admin SDK** - Ma'lumotlar bazasi
- **TypeScript** - Dasturlash tili
- **Winston** - Logging
- **class-validator** - Validatsiya
- **class-transformer** - Ma'lumotlarni transformatsiya qilish

## Litsenziya

MIT
