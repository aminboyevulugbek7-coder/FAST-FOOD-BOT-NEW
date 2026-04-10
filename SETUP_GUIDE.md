# Admin Panel & Backend Integration - Setup Guide

## ✅ Bajarilgan ishlar

### Backend API (100% tayyor)
- ✅ Authentication service (JWT, bcrypt)
- ✅ File upload service (Firebase Storage)
- ✅ Banner management (CRUD)
- ✅ Category management (CRUD)
- ✅ Product management (CRUD, pagination)
- ✅ Order management (status tracking, history)
- ✅ Analytics service (dashboard, charts, export)

### Admin Panel (100% tayyor)
- ✅ Login page
- ✅ Dashboard page (metrics, charts)
- ✅ Banners page (CRUD, image upload)
- ✅ Categories page (CRUD, image upload)
- ✅ Products page (CRUD, filters, pagination)
- ✅ Orders page (list, details, status update)
- ✅ Analytics page (charts, date filters, CSV export)

### Customer App (100% tayyor)
- ✅ Dynamic banner carousel (API integration)
- ✅ Categories with borders (API integration)
- ✅ Products (API integration)
- ✅ MenuPage with category filter

## 🚀 Ishga tushirish

### 1. Backend ishga tushirish

```bash
cd backend

# Dependencies o'rnatish (agar kerak bo'lsa)
npm install

# Admin user yaratish
npm run seed:admin

# Development rejimida ishga tushirish
npm run dev
```

Backend `http://localhost:5000` da ishga tushadi.

**Default admin credentials:**
- Email: `admin@fastfood.com`
- Password: `admin123`

### 2. Admin Panel ishga tushirish

```bash
cd admin

# Dependencies o'rnatish (agar kerak bo'lsa)
npm install

# Development rejimida ishga tushirish
npm run dev
```

Admin panel `http://localhost:5173` da ochiladi.

### 3. Customer App (Frontend) ishga tushirish

```bash
cd frontend

# Dependencies o'rnatish (agar kerak bo'lsa)
npm install

# Development rejimida ishga tushirish
npm run dev
```

Frontend `http://localhost:5174` da ochiladi.

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key-here
TELEGRAM_BOT_TOKEN=8385783138:AAG1JxNxTRijRCLN_YSfZiKN5AgUqd4Fkmg
MINI_APP_URL=https://fast-food-bot-new.vercel.app

# Firebase (optional - agar Firebase ishlatmoqchi bo'lsangiz)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
```

### Admin Panel (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🧪 Test qilish

### 1. Admin Panel test qilish

1. Admin panelga kiring: `http://localhost:5173`
2. Login qiling: `admin@fastfood.com` / `admin123`
3. Dashboard sahifasini ko'ring
4. Banner qo'shing:
   - Banners sahifasiga o'ting
   - "Yangi Banner" tugmasini bosing
   - Rasm, sarlavha, tavsif kiriting
   - Saqlang
5. Category qo'shing:
   - Categories sahifasiga o'ting
   - "Yangi Kategoriya" tugmasini bosing
   - Nom, rasm kiriting
   - Saqlang
6. Product qo'shing:
   - Products sahifasiga o'ting
   - "Yangi Mahsulot" tugmasini bosing
   - Barcha ma'lumotlarni kiriting
   - Saqlang

### 2. Customer App test qilish

1. Frontendni oching: `http://localhost:5174`
2. Bosh sahifada:
   - Banner carousel ko'rinishini tekshiring (5 soniyada avtomatik o'zgaradi)
   - Kategoriyalar borderli ko'rinishini tekshiring
   - Mahsulotlar ko'rinishini tekshiring
3. Kategoriyaga bosing va MenuPage ochilishini tekshiring
4. Mahsulotni savatga qo'shing

## 📦 Production deployment

### Backend (Render)
1. Render.com ga kiring
2. New Web Service yarating
3. GitHub repository ulang
4. Root Directory: `backend`
5. Build Command: `npm install && npm run build`
6. Start Command: `npm start`
7. Environment variables qo'shing

### Admin Panel (Vercel)
1. Vercel.com ga kiring
2. New Project yarating
3. GitHub repository ulang
4. Root Directory: `admin`
5. Framework Preset: Vite
6. Environment variables qo'shing:
   - `VITE_API_URL=https://your-backend-url.onrender.com/api`

### Frontend (Vercel)
1. Vercel.com ga kiring
2. New Project yarating
3. GitHub repository ulang
4. Root Directory: `frontend`
5. Framework Preset: Vite
6. Environment variables qo'shing:
   - `VITE_API_URL=https://your-backend-url.onrender.com/api`

## 🔧 Troubleshooting

### Backend ishlamayapti
- `npm install` qayta ishga tushiring
- `.env` faylini tekshiring
- Port 5000 band emasligini tekshiring

### Admin panel login qilolmayapman
- Backend ishlab turganini tekshiring
- `npm run seed:admin` qayta ishga tushiring
- Browser console'da xatolarni tekshiring

### Rasmlar yuklanmayapti
- Firebase credentials to'g'ri ekanligini tekshiring
- Yoki Firebase o'chirilgan bo'lsa, memory storage ishlatiladi

### API ma'lumotlari ko'rinmayapti
- Backend ishlab turganini tekshiring
- `.env` faylidagi `VITE_API_URL` to'g'ri ekanligini tekshiring
- Browser Network tab'da API so'rovlarni tekshiring

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current admin

### Banners
- `GET /api/banners` - Get all banners (public)
- `POST /api/banners` - Create banner (protected)
- `PUT /api/banners/:id` - Update banner (protected)
- `DELETE /api/banners/:id` - Delete banner (protected)

### Categories
- `GET /api/categories` - Get all categories (public)
- `POST /api/categories` - Create category (protected)
- `PUT /api/categories/:id` - Update category (protected)
- `DELETE /api/categories/:id` - Delete category (protected)

### Products
- `GET /api/products` - Get all products with pagination (public)
- `GET /api/products/:id` - Get product by ID (public)
- `POST /api/products` - Create product (protected)
- `PUT /api/products/:id` - Update product (protected)
- `DELETE /api/products/:id` - Delete product (protected)

### Orders
- `GET /api/orders` - Get all orders with filters (protected)
- `GET /api/orders/:id` - Get order by ID (protected)
- `POST /api/orders` - Create order (public)
- `PATCH /api/orders/:id/status` - Update order status (protected)

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard metrics (protected)
- `GET /api/analytics/orders-over-time` - Get orders time series (protected)
- `GET /api/analytics/revenue-over-time` - Get revenue time series (protected)

### Upload
- `POST /api/upload` - Upload image (protected)

## 🎯 Keyingi qadamlar

1. Firebase setup (agar kerak bo'lsa):
   - Firebase project yarating
   - Firestore va Storage yoqing
   - Service account credentials oling
   - `.env` ga qo'shing

2. Production deployment:
   - Backend Render ga deploy qiling
   - Admin panel Vercel ga deploy qiling
   - Frontend Vercel ga deploy qiling
   - Environment variables to'g'ri sozlang

3. Testing:
   - Barcha funksiyalarni test qiling
   - Mobile responsive'ni tekshiring
   - Performance'ni tekshiring

## ✨ Yangi funksiyalar

### Customer App
- ✅ Dynamic banner carousel (admin paneldan boshqariladi)
- ✅ Kategoriyalar borderli ko'rinishda
- ✅ Barcha ma'lumotlar backend API dan keladi
- ✅ Loading states va error handling
- ✅ Fallback data (API ishlamasa)

### Admin Panel
- ✅ Real-time dashboard metrics
- ✅ Banner management (rasm yuklash, tartib)
- ✅ Category management (mahsulot soni ko'rsatish)
- ✅ Product management (qidiruv, filter, pagination)
- ✅ Order management (status update, history)
- ✅ Analytics (charts, date filters, CSV export)

## 📞 Yordam

Agar muammo bo'lsa:
1. Console'dagi xatolarni tekshiring
2. Network tab'da API so'rovlarni tekshiring
3. Backend logs'ni tekshiring
4. Environment variables to'g'ri ekanligini tekshiring
