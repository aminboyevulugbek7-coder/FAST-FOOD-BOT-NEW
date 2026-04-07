# 🚀 Deployment Guide - Fast Food Bagat

## Frontend ni Vercel ga deploy qilish

### 1. Vercel Account yaratish
1. [vercel.com](https://vercel.com) ga kiring
2. GitHub account bilan ro'yxatdan o'ting

### 2. Frontend ni deploy qilish

#### A. Vercel CLI orqali (Tezkor)
```bash
# Vercel CLI ni o'rnatish
npm install -g vercel

# Frontend papkasiga o'tish
cd frontend

# Deploy qilish
vercel

# Production ga deploy qilish
vercel --prod
```

#### B. Vercel Dashboard orqali
1. [vercel.com/new](https://vercel.com/new) ga kiring
2. "Import Git Repository" tugmasini bosing
3. GitHub repository ni tanlang
4. Root Directory: `frontend` ni tanlang
5. Framework Preset: `Vite` ni tanlang
6. Build Command: `npm run build`
7. Output Directory: `dist`
8. "Deploy" tugmasini bosing

### 3. Deploy qilingandan keyin

Deploy tugagach, Vercel sizga URL beradi, masalan:
```
https://your-app-name.vercel.app
```

Bu URL ni `.env` fayliga qo'shing:

```bash
# backend/.env
MINI_APP_URL=https://your-app-name.vercel.app
```

### 4. Backend serverni qayta ishga tushirish

```bash
cd backend
npm run dev
```

### 5. Telegram botni test qilish

Telegram botga `/start` buyrug'ini yuboring. Endi Mini App tugmasi ochilishi kerak!

---

## Backend ni Render ga deploy qilish (Ixtiyoriy)

### 1. Render Account yaratish
1. [render.com](https://render.com) ga kiring
2. GitHub account bilan ro'yxatdan o'ting

### 2. Backend ni deploy qilish

1. [render.com/new/web-service](https://dashboard.render.com/create?type=web) ga kiring
2. GitHub repository ni tanlang
3. Quyidagi sozlamalarni kiriting:
   - Name: `fastfood-backend`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
4. Environment Variables qo'shing:
   ```
   TELEGRAM_BOT_TOKEN=8385783138:AAG1JxNxTRijRCLN_YSfZiKN5AgUqd4Fkmg
   MINI_APP_URL=https://your-app-name.vercel.app
   NODE_ENV=production
   PORT=5001
   ```
5. "Create Web Service" tugmasini bosing

### 3. Backend URL ni frontend ga qo'shish

Backend deploy qilingandan keyin, Render sizga URL beradi:
```
https://fastfood-backend.onrender.com
```

Frontend `.env` fayliga qo'shing:
```bash
# frontend/.env
VITE_API_URL=https://fastfood-backend.onrender.com/api
```

Frontend ni qayta deploy qiling:
```bash
cd frontend
vercel --prod
```

---

## Production Checklist

- [ ] Frontend Vercel ga deploy qilindi
- [ ] Backend `.env` da `MINI_APP_URL` yangilandi
- [ ] Telegram botda Mini App tugmasi ishlayapti
- [ ] Firebase credentials production uchun sozlandi (ixtiyoriy)
- [ ] Backend Render ga deploy qilindi (ixtiyoriy)
- [ ] Frontend `.env` da `VITE_API_URL` yangilandi (ixtiyoriy)

---

## Ngrok (Development uchun)

Agar hali production ga deploy qilmasangiz, ngrok ishlatishingiz mumkin:

```bash
# Frontend uchun ngrok
ngrok http 5173
```

Ngrok URL ni `.env` ga qo'shing:
```bash
MINI_APP_URL=https://your-ngrok-url.ngrok-free.dev
```

**Eslatma:** Ngrok URL har safar o'zgaradi, shuning uchun production uchun Vercel yaxshiroq.
