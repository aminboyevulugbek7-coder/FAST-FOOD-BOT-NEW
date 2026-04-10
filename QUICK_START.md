# 🚀 Quick Start Guide

## ✅ Bajarilgan ishlar (100%)

### Backend API
- ✅ Authentication (JWT)
- ✅ File Upload (Firebase Storage)
- ✅ Banner CRUD
- ✅ Category CRUD
- ✅ Product CRUD
- ✅ Order Management
- ✅ Analytics

### Admin Panel
- ✅ Login
- ✅ Dashboard
- ✅ Banners
- ✅ Categories
- ✅ Products
- ✅ Orders
- ✅ Analytics

### Customer App
- ✅ Dynamic Banner Carousel
- ✅ Categories (borderli)
- ✅ Products (API dan)
- ✅ MenuPage (filter bilan)

## 🏃 Ishga tushirish (3 qadam)

### 1️⃣ Backend
```bash
cd backend
npm install
npm run seed:admin
npm run dev
```
✅ Backend: http://localhost:5000

### 2️⃣ Admin Panel
```bash
cd admin
npm install
npm run dev
```
✅ Admin: http://localhost:5173
📧 Login: admin@fastfood.com / admin123

### 3️⃣ Customer App
```bash
cd frontend
npm install
npm run dev
```
✅ Frontend: http://localhost:5174

## 🧪 Test qilish

1. **Admin panelga kiring**
   - http://localhost:5173
   - Login: admin@fastfood.com / admin123

2. **Banner qo'shing**
   - Banners → Yangi Banner
   - Rasm, sarlavha, tavsif kiriting

3. **Category qo'shing**
   - Categories → Yangi Kategoriya
   - Nom, rasm kiriting

4. **Product qo'shing**
   - Products → Yangi Mahsulot
   - Barcha ma'lumotlarni kiriting

5. **Customer app'ni oching**
   - http://localhost:5174
   - Banner carousel ko'ring
   - Kategoriyalar borderli ko'ring
   - Mahsulotlar API dan kelishini ko'ring

## 📁 Yangi fayllar

### Customer App
- `frontend/src/components/BannerCarousel.tsx` - Banner carousel
- `frontend/.env` - API URL

### Admin Panel
- `admin/.env` - API URL

### O'zgartirilgan fayllar
- `frontend/src/pages/HomePage.tsx` - Banner, kategoriyalar, mahsulotlar
- `frontend/src/components/FeaturedProducts.tsx` - API integration
- `frontend/src/pages/MenuPage.tsx` - Category filter
- `frontend/src/vite-env.d.ts` - TypeScript types

## 🌐 API Endpoints

### Public (hamma uchun)
- `GET /api/banners` - Bannerlar
- `GET /api/categories` - Kategoriyalar
- `GET /api/products` - Mahsulotlar
- `POST /api/orders` - Buyurtma yaratish

### Protected (admin uchun)
- `POST /api/auth/login` - Login
- `POST /api/upload` - Rasm yuklash
- `POST /api/banners` - Banner yaratish
- `POST /api/categories` - Category yaratish
- `POST /api/products` - Product yaratish
- `GET /api/orders` - Buyurtmalar ro'yxati
- `GET /api/analytics/dashboard` - Dashboard

## 🎯 Asosiy funksiyalar

### Admin Panel
✅ Banner boshqarish (rasm yuklash, tartib)
✅ Category boshqarish (mahsulot soni)
✅ Product boshqarish (qidiruv, filter, pagination)
✅ Order boshqarish (status, history)
✅ Analytics (charts, CSV export)

### Customer App
✅ Dynamic banner carousel (5 soniyada o'zgaradi)
✅ Kategoriyalar borderli (gradient)
✅ Mahsulotlar API dan
✅ Loading states
✅ Error handling

## 🔧 Muammolar

### Backend ishlamayapti?
```bash
cd backend
npm install
npm run dev
```

### Admin panelga kirish muammosi?
```bash
cd backend
npm run seed:admin
```

### API ma'lumotlari ko'rinmayapti?
1. Backend ishlab turganini tekshiring
2. `.env` faylidagi `VITE_API_URL` to'g'ri ekanligini tekshiring
3. Browser console'da xatolarni tekshiring

## 📦 Production Deployment

### Backend → Render
- Root Directory: `backend`
- Build: `npm install && npm run build`
- Start: `npm start`

### Admin Panel → Vercel
- Root Directory: `admin`
- Framework: Vite
- Env: `VITE_API_URL=https://your-backend.onrender.com/api`

### Frontend → Vercel
- Root Directory: `frontend`
- Framework: Vite
- Env: `VITE_API_URL=https://your-backend.onrender.com/api`

## 📚 Qo'shimcha ma'lumot

- `SETUP_GUIDE.md` - To'liq setup guide
- `ADMIN_PANEL_IMPLEMENTATION.md` - Implementation details
- `.kiro/specs/admin-panel-backend-integration/` - Spec files

## ✨ Yangi imkoniyatlar

1. **Dynamic Banners** - Admin paneldan boshqariladigan bannerlar
2. **Borderli Kategoriyalar** - Gradient border bilan chiroyli ko'rinish
3. **API Integration** - Barcha ma'lumotlar backend dan
4. **Loading States** - Foydalanuvchi tajribasi yaxshilandi
5. **Error Handling** - API ishlamasa fallback data

## 🎉 Tayyor!

Barcha funksiyalar tayyor va test qilishga tayyor!

Agar savol bo'lsa:
1. Console'dagi xatolarni tekshiring
2. Network tab'da API so'rovlarni tekshiring
3. Backend logs'ni tekshiring
