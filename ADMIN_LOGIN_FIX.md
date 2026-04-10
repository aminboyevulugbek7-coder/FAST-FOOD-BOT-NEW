# 🔐 Admin Panel Login Muammosini Hal Qilish

## Muammo
Admin panelga kirganda login va parol kiritilgandan keyin sahifa tozalanib, login bo'lmayapti.

## Sabab
1. Admin panel eski tokenlarni localStorage da saqlagan
2. TypeScript konfiguratsiyasi to'liq emas edi
3. Backend 5001 portda ishlayapti, lekin ba'zi joylar 5000 portga murojaat qilgan

## ✅ Hal Qilingan Muammolar

### 1. TypeScript Konfiguratsiyasi
- ✅ `admin/src/vite-env.d.ts` fayli yaratildi
- ✅ `VITE_API_URL` environment variable uchun type definition qo'shildi
- ✅ Barcha TypeScript xatolari tuzatildi

### 2. API URL Konfiguratsiyasi
- ✅ `admin/.env` faylida `VITE_API_URL=http://localhost:5001/api` to'g'ri sozlangan
- ✅ `admin/src/store/authStore.ts` real backend API dan foydalanadi
- ✅ `admin/src/services/api.ts` to'g'ri portga murojaat qiladi

### 3. Backend Konfiguratsiyasi
- ✅ Backend 5001 portda ishlayapti
- ✅ CORS to'g'ri sozlangan
- ✅ Firebase bilan ulanish ishlayapti
- ✅ Admin user yaratilgan: `admin@fastfood.com` / `admin123`

## 🚀 Hal Qilish Qadamlari

### Qadam 1: Admin Panel Serverini To'xtatish
Admin panel terminalida `Ctrl+C` bosing va serverni to'xtating.

### Qadam 2: LocalStorage ni Tozalash

**Variant A: Browser DevTools orqali**
1. Admin panel sahifasini oching: http://localhost:5174
2. Browser da `F12` bosing (DevTools ochish uchun)
3. Console tabiga o'ting
4. Quyidagi kodni kiriting va Enter bosing:
```javascript
localStorage.clear()
```
5. Sahifani yangilang: `Ctrl+R` yoki `F5`

**Variant B: Test sahifa orqali**
1. `test-login.html` faylini browser da oching
2. "Clear LocalStorage" tugmasini bosing
3. "Test Login" tugmasini bosing va login ishlashini tekshiring

### Qadam 3: Admin Panel Serverini Qayta Ishga Tushirish
```bash
cd admin
npm run dev
```

### Qadam 4: Login Qilish
1. Browser da http://localhost:5174 ga o'ting
2. Login ma'lumotlarini kiriting:
   - **Email:** admin@fastfood.com
   - **Password:** admin123
3. "Login" tugmasini bosing
4. Muvaffaqiyatli login bo'lganingizdan keyin Dashboard sahifasiga o'tasiz

## 🧪 Test Qilish

### Backend Test
```bash
# Backend ishlayotganini tekshirish
curl http://localhost:5001/health

# Login API ni test qilish
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fastfood.com","password":"admin123"}'
```

### Browser Test
`test-login.html` faylini browser da oching va quyidagi tugmalarni sinab ko'ring:
- **Test Login** - Backend login API ni test qiladi
- **Clear LocalStorage** - LocalStorage ni tozalaydi
- **Check Storage** - LocalStorage dagi ma'lumotlarni ko'rsatadi

## 📝 Muhim Eslatmalar

1. **Backend albatta ishlab turishi kerak**
   ```bash
   cd backend
   npm run dev
   ```
   Backend 5001 portda ishlab turishi kerak.

2. **Admin Panel 5174 portda ishlaydi**
   ```bash
   cd admin
   npm run dev
   ```

3. **Agar login hali ham ishlamasa:**
   - Browser cache ni tozalang: `Ctrl+Shift+Delete`
   - Browser ni yoping va qayta oching
   - Incognito/Private mode da sinab ko'ring

4. **Console da xatolarni tekshiring:**
   - Browser da `F12` bosing
   - Console tabiga o'ting
   - Qizil xatolar bormi tekshiring

## 🔍 Agar Muammo Davom Etsa

### Backend Loglarini Tekshirish
Backend terminalida quyidagi loglar ko'rinishi kerak:
```
✅ Firebase initialized successfully
🚀 Server running on port 5001
📱 Environment: development
💡 API available at http://localhost:5001/api
```

### Network Xatolarini Tekshirish
Browser DevTools da:
1. Network tabiga o'ting
2. Login tugmasini bosing
3. `login` so'rovini toping
4. Status code 200 bo'lishi kerak
5. Response da `success: true` va `token` bo'lishi kerak

### CORS Xatosi
Agar "CORS policy" xatosi ko'rsatilsa:
- Backend serverni qayta ishga tushiring
- Admin panel serverini qayta ishga tushiring

## ✅ Muvaffaqiyatli Login Belgisi

Login muvaffaqiyatli bo'lganda:
1. Console da: `✅ Login successful!` ko'rinadi
2. LocalStorage da `admin_token` va `admin_user` saqlanadi
3. Avtomatik Dashboard sahifasiga o'tasiz
4. Yuqori o'ng burchakda admin nomi ko'rinadi

## 📞 Qo'shimcha Yordam

Agar yuqoridagi qadamlar yordam bermasa:
1. Backend va Admin panel loglarini ko'rsating
2. Browser console dagi xatolarni ko'rsating
3. Network tab dagi so'rovlarni tekshiring
