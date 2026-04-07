# Telegram Bot Sozlash Qo'llanmasi

## 1. Telegram Bot Yaratish

### BotFather orqali bot yaratish:

1. Telegram da [@BotFather](https://t.me/BotFather) ni oching
2. `/newbot` buyrug'ini yuboring
3. Bot uchun nom kiriting (masalan: "Fast Food Bagat")
4. Bot uchun username kiriting (masalan: "fastfood_bagat_bot")
5. BotFather sizga bot tokenni beradi (masalan: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

### Bot tokenni saqlash:

`backend/.env` fayliga qo'shing:

```env
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
```

## 2. Firebase Sozlash

### Firebase loyiha yaratish:

1. [Firebase Console](https://console.firebase.google.com/) ga kiring
2. "Add project" tugmasini bosing
3. Loyiha nomini kiriting (masalan: "fastfood-bagat")
4. Google Analytics ni yoqing (ixtiyoriy)

### Firestore Database yoqish:

1. Firebase Console da "Firestore Database" ga o'ting
2. "Create database" tugmasini bosing
3. "Start in test mode" ni tanlang (keyinchalik security rules sozlash mumkin)
4. Location tanlang (masalan: "asia-southeast1")

### Service Account kalitini olish:

1. Firebase Console da "Project settings" ga o'ting
2. "Service accounts" tabiga o'ting
3. "Generate new private key" tugmasini bosing
4. JSON fayl yuklab olinadi

### Firebase ma'lumotlarini .env ga qo'shish:

JSON fayldan quyidagi ma'lumotlarni oling va `.env` ga qo'shing:

```env
FIREBASE_PROJECT_ID=fastfood-bagat
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@fastfood-bagat.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://fastfood-bagat-default-rtdb.firebaseio.com
```

**Muhim:** `FIREBASE_PRIVATE_KEY` ni qo'shtirnoq ichida yozing va `\n` belgilarini saqlab qoling.

## 3. Admin Foydalanuvchilarni Sozlash

### Admin Telegram ID larini olish:

1. [@userinfobot](https://t.me/userinfobot) ga o'ting
2. Botga `/start` yuboring
3. Bot sizga Telegram ID ni beradi (masalan: `123456789`)

### Admin ID larni .env ga qo'shish:

```env
TELEGRAM_ADMIN_IDS=123456789,987654321
```

Bir nechta admin bo'lsa, vergul bilan ajrating.

## 4. Backend ni Ishga Tushirish

### Dependencies o'rnatish:

```bash
cd backend
npm install
```

### .env faylini tekshirish:

Barcha kerakli environment variables to'ldirilganligini tekshiring:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/fastfood-telegram
JWT_SECRET=your-super-secret-jwt-key
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_ADMIN_IDS=123456789
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="your-private-key"
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
```

### Development mode da ishga tushirish:

```bash
npm run dev
```

### Production mode da ishga tushirish:

```bash
npm run build
npm start
```

## 5. Bot ni Sinab Ko'rish

### Telegram da botni ochish:

1. Telegram da o'z botingizni qidiring (masalan: @fastfood_bagat_bot)
2. `/start` buyrug'ini yuboring
3. Bot sizdan telefon raqamni so'raydi
4. "📱 Telefon raqamni ulashish" tugmasini bosing
5. Ismingizni kiriting
6. Ro'yxatdan o'tish yakunlandi!

### Bot buyruqlari:

- `/start` - Botni ishga tushirish
- `/profile` - Profil ma'lumotlarini ko'rish
- `🍔 Menyu` - Mahsulotlar katalogi
- `🛒 Savat` - Savat
- `📦 Buyurtmalar` - Buyurtmalar tarixi
- `👤 Profil` - Profil

## 6. Muammolarni Hal Qilish

### Bot ishlamayapti:

1. `backend/.env` faylida `TELEGRAM_BOT_TOKEN` to'g'ri ekanligini tekshiring
2. Backend server ishlab turganligini tekshiring: `npm run dev`
3. Loglarni tekshiring: `backend/logs/combined.log`

### Firebase xatosi:

1. Firebase credentials to'g'ri ekanligini tekshiring
2. Firestore Database yoqilganligini tekshiring
3. Service Account kaliti to'g'ri formatda ekanligini tekshiring

### Bot javob bermayapti:

1. Internet aloqasini tekshiring
2. Bot tokenni BotFather da revoke qilmagan bo'lishingizni tekshiring
3. Backend loglarni tekshiring

## 7. Keyingi Qadamlar

- ✅ Mahsulotlar katalogini Firebase ga qo'shish
- ✅ Savat funksiyasini to'liq ishlab chiqish
- ✅ Buyurtma berish jarayonini yakunlash
- ✅ To'lov integratsiyasi
- ✅ Admin panel funksiyalarini qo'shish

## Yordam

Agar savollar bo'lsa, quyidagi hujjatlarni o'qing:

- [Telegraf Documentation](https://telegraf.js.org/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Express.js Documentation](https://expressjs.com/)
