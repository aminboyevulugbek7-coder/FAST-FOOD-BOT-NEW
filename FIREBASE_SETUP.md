# Firebase Production Setup Guide

## 📋 Umumiy ma'lumot

Admin panel va backend API Firebase Firestore va Firebase Storage ishlatadi:
- **Firestore**: Ma'lumotlar bazasi (admins, banners, categories, products, orders)
- **Storage**: Rasmlar saqlash (banner, category, product rasmlari)

## 🚀 1-qadam: Firebase loyihasini yaratish

1. **Firebase Console ga kiring**
   - [https://console.firebase.google.com/](https://console.firebase.google.com/) ga o'ting
   - Google akkauntingiz bilan kiring

2. **Yangi loyiha yarating**
   - "Add project" tugmasini bosing
   - Loyiha nomini kiriting: `fast-food-bagat` (yoki o'zingiz xohlagan nom)
   - Google Analytics ni yoqish/o'chirish (ixtiyoriy)
   - "Create project" tugmasini bosing
   - Loyiha yaratilishini kuting (1-2 daqiqa)

## 🗄️ 2-qadam: Firestore Database sozlash

1. **Firestore ni yoqing**
   - Chap menuda "Build" > "Firestore Database" ni tanlang
   - "Create database" tugmasini bosing

2. **Security rules ni tanlang**
   - **Production mode** ni tanlang (tavsiya etiladi)
   - Location ni tanlang: `asia-south1` (Hindiston - eng yaqin server)
   - "Enable" tugmasini bosing

3. **Security Rules ni sozlang**
   - "Rules" tabiga o'ting
   - Quyidagi qoidalarni kiriting:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admins collection - faqat authenticated adminlar
    match /admins/{adminId} {
      allow read, write: if false; // Faqat backend orqali
    }
    
    // Banners - o'qish hammaga, yozish faqat backend
    match /banners/{bannerId} {
      allow read: if true;
      allow write: if false; // Faqat backend orqali
    }
    
    // Categories - o'qish hammaga, yozish faqat backend
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if false; // Faqat backend orqali
    }
    
    // Products - o'qish hammaga, yozish faqat backend
    match /products/{productId} {
      allow read: if true;
      allow write: if false; // Faqat backend orqali
    }
    
    // Orders - faqat backend orqali
    match /orders/{orderId} {
      allow read, write: if false; // Faqat backend orqali
    }
  }
}
```

4. **Publish** tugmasini bosing

## 📦 3-qadam: Firebase Storage sozlash

1. **Storage ni yoqing**
   - Chap menuda "Build" > "Storage" ni tanlang
   - "Get started" tugmasini bosing
   - Security rules: **Production mode** ni tanlang
   - Location: `asia-south1` ni tanlang
   - "Done" tugmasini bosing

2. **Storage Rules ni sozlang**
   - "Rules" tabiga o'ting
   - Quyidagi qoidalarni kiriting:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Rasmlarni hammaga ko'rsatish, lekin yuklash faqat backend orqali
    match /{allPaths=**} {
      allow read: if true;
      allow write: if false; // Faqat backend orqali
    }
  }
}
```

3. **Publish** tugmasini bosing

## 🔑 4-qadam: Service Account credentials olish

1. **Project Settings ga o'ting**
   - Yuqori chap burchakdagi ⚙️ (Settings) ikonkasini bosing
   - "Project settings" ni tanlang

2. **Service Accounts tabiga o'ting**
   - "Service accounts" tabini tanlang
   - "Generate new private key" tugmasini bosing
   - "Generate key" ni tasdiqlang
   - JSON fayl yuklab olinadi (masalan: `fast-food-bagat-firebase-adminsdk-xxxxx.json`)

3. **JSON faylni oching**
   - Yuklab olingan JSON faylni matn muharririda oching
   - Quyidagi ma'lumotlarni topib oling:
     - `project_id`
     - `private_key`
     - `client_email`

## 📝 5-qadam: Backend .env faylini yangilash

1. **backend/.env faylini oching**

2. **Firebase ma'lumotlarini kiriting**:

```env
PORT=5001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development

# Telegram Bot
TELEGRAM_BOT_TOKEN=8385783138:AAG1JxNxTRijRCLN_YSfZiKN5AgUqd4Fkmg
TELEGRAM_ADMIN_IDS=123456789

# Mini App URL
MINI_APP_URL=https://fast-food-bot-new.vercel.app

# Firebase - JSON fayldan olingan ma'lumotlar
FIREBASE_PROJECT_ID=fast-food-bagat
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@fast-food-bagat.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://fast-food-bagat-default-rtdb.firebaseio.com

# Admin user credentials
ADMIN_EMAIL=admin@fastfood.com
ADMIN_PASSWORD=admin123
ADMIN_NAME=Admin User
```

**MUHIM:**
- `FIREBASE_PRIVATE_KEY` ni to'liq nusxalang (qo'shtirnoq ichida)
- `\n` belgilarini o'zgartirmang
- Private key juda uzun bo'ladi (1500+ belgi)

## 🌱 6-qadam: Admin user yaratish

1. **Backend serverni to'xtating** (agar ishlab turgan bo'lsa):
   ```bash
   # Terminal da Ctrl+C bosing
   ```

2. **Backend serverni qayta ishga tushiring**:
   ```bash
   cd backend
   npm run dev
   ```

3. **Admin user yaratish**:
   ```bash
   # Yangi terminal oching
   cd backend
   npm run seed:admin
   ```

4. **Natijani tekshiring**:
   ```
   ✅ Admin user created successfully!
      ID: xxxxxxxxxxxxx
      Email: admin@fastfood.com
      Password: admin123
      Role: super_admin
   ```

## ✅ 7-qadam: Test qilish

1. **Admin panelni oching**:
   - Browser da: `http://localhost:5174`

2. **Login qiling**:
   - Email: `admin@fastfood.com`
   - Password: `admin123`

3. **Dashboard ko'ring**:
   - Agar muvaffaqiyatli kirgan bo'lsangiz, dashboard sahifasi ochiladi

4. **Test ma'lumotlar qo'shing**:
   - Banner qo'shing
   - Category qo'shing
   - Product qo'shing

## 🚀 8-qadam: Production deployment

### Backend (Render.com)

1. **Render.com ga kiring**
   - [https://render.com/](https://render.com/) ga o'ting
   - GitHub bilan kiring

2. **New Web Service yarating**
   - "New +" > "Web Service"
   - GitHub repository ni ulang
   - Repository: `your-repo-name`
   - Branch: `main`

3. **Settings**:
   - Name: `fast-food-backend`
   - Region: `Singapore` (eng yaqin)
   - Branch: `main`
   - Root Directory: `backend`
   - Runtime: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

4. **Environment Variables qo'shing**:
   ```
   PORT=5001
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   TELEGRAM_BOT_TOKEN=8385783138:AAG1JxNxTRijRCLN_YSfZiKN5AgUqd4Fkmg
   MINI_APP_URL=https://fast-food-bot-new.vercel.app
   FIREBASE_PROJECT_ID=fast-food-bagat
   FIREBASE_PRIVATE_KEY=<JSON fayldan olingan private key>
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@fast-food-bagat.iam.gserviceaccount.com
   FIREBASE_DATABASE_URL=https://fast-food-bagat-default-rtdb.firebaseio.com
   ADMIN_EMAIL=admin@fastfood.com
   ADMIN_PASSWORD=admin123
   ADMIN_NAME=Admin User
   ```

5. **Deploy qiling**
   - "Create Web Service" tugmasini bosing
   - Deploy jarayonini kuting (5-10 daqiqa)
   - Backend URL ni oling: `https://fast-food-backend.onrender.com`

### Admin Panel (Vercel)

1. **Vercel.com ga kiring**
   - [https://vercel.com/](https://vercel.com/) ga o'ting
   - GitHub bilan kiring

2. **New Project yarating**
   - "Add New..." > "Project"
   - GitHub repository ni tanlang
   - "Import" tugmasini bosing

3. **Settings**:
   - Project Name: `fast-food-admin`
   - Framework Preset: `Vite`
   - Root Directory: `admin`

4. **Environment Variables qo'shing**:
   ```
   VITE_API_URL=https://fast-food-backend.onrender.com/api
   ```

5. **Deploy qiling**
   - "Deploy" tugmasini bosing
   - Deploy jarayonini kuting (2-3 daqiqa)
   - Admin panel URL ni oling: `https://fast-food-admin.vercel.app`

### Frontend (Vercel)

1. **Yangi Project yarating**
   - "Add New..." > "Project"
   - Xuddi shu repository ni tanlang

2. **Settings**:
   - Project Name: `fast-food-customer`
   - Framework Preset: `Vite`
   - Root Directory: `frontend`

3. **Environment Variables qo'shing**:
   ```
   VITE_API_URL=https://fast-food-backend.onrender.com/api
   ```

4. **Deploy qiling**
   - "Deploy" tugmasini bosing
   - Frontend URL ni oling: `https://fast-food-customer.vercel.app`

## 🔐 9-qadam: Production xavfsizligi

1. **JWT_SECRET ni o'zgartiring**:
   - Kuchli parol yarating (32+ belgi)
   - Render.com da environment variable ni yangilang

2. **Admin parolini o'zgartiring**:
   - Admin panelga kiring
   - Profile > Change Password
   - Kuchli parol o'rnating

3. **Firebase Security Rules ni tekshiring**:
   - Firestore va Storage rules to'g'ri sozlanganini tekshiring
   - Faqat backend orqali yozish mumkin bo'lishi kerak

4. **CORS ni sozlang**:
   - Backend da faqat kerakli domenlarni ruxsat bering
   - `backend/src/server.ts` da CORS sozlamalarini tekshiring

## 📊 10-qadam: Monitoring va Logs

1. **Render.com Logs**:
   - Render dashboard > Your service > Logs
   - Real-time logs ko'ring

2. **Firebase Console**:
   - Firestore > Data
   - Ma'lumotlar bazasini monitoring qiling

3. **Vercel Analytics**:
   - Vercel dashboard > Your project > Analytics
   - Traffic va performance ko'ring

## 🆘 Troubleshooting

### Firebase connection error
- `.env` fayldagi credentials to'g'ri ekanligini tekshiring
- `FIREBASE_PRIVATE_KEY` to'liq nusxalanganini tekshiring
- Qo'shtirnoqlar ichida bo'lishi kerak

### Admin user yaratilmayapti
- Firebase Firestore yoqilganini tekshiring
- Backend logs ni tekshiring
- `npm run seed:admin` qayta ishga tushiring

### Login ishlamayapti
- Backend ishlab turganini tekshiring
- Admin user yaratilganini Firestore da tekshiring
- Browser console da xatolarni tekshiring

### Rasmlar yuklanmayapti
- Firebase Storage yoqilganini tekshiring
- Storage rules to'g'ri sozlanganini tekshiring
- Backend logs ni tekshiring

## 📞 Yordam

Agar muammo bo'lsa:
1. Backend logs ni tekshiring
2. Firebase Console da ma'lumotlarni tekshiring
3. Browser Network tab da API so'rovlarni tekshiring
4. Environment variables to'g'ri ekanligini tekshiring

---

**Keyingi qadam**: Firebase loyihasini yarating va credentials ni oling, keyin men sizga yordam beraman!
