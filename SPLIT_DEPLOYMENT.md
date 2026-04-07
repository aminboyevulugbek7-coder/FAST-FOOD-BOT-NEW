# 🔀 Monorepo ni ajratish va deploy qilish

## Variant 1: Yangi Git Repository lar yaratish (Tavsiya etiladi)

### 1. Frontend uchun yangi repository

```bash
# Yangi papka yaratish
mkdir fastfood-frontend-deploy
cd fastfood-frontend-deploy

# Git init
git init

# Frontend fayllarini ko'chirish
cp -r ../delivery/frontend/* .
cp ../delivery/frontend/.gitignore .

# Git ga qo'shish
git add .
git commit -m "Initial frontend commit"

# GitHub ga push
git remote add origin https://github.com/YOUR_USERNAME/fastfood-frontend.git
git branch -M main
git push -u origin main
```

### 2. Backend uchun yangi repository

```bash
# Yangi papka yaratish
mkdir fastfood-backend-deploy
cd fastfood-backend-deploy

# Git init
git init

# Backend fayllarini ko'chirish
cp -r ../delivery/backend/* .
cp ../delivery/backend/.env.example .env.example
cp ../delivery/backend/.gitignore .

# Git ga qo'shish
git add .
git commit -m "Initial backend commit"

# GitHub ga push
git remote add origin https://github.com/YOUR_USERNAME/fastfood-backend.git
git branch -M main
git push -u origin main
```

---

## Variant 2: Git Subtree (Ilg'or)

### Frontend ni ajratish

```bash
cd delivery

# Frontend uchun yangi branch yaratish
git subtree split --prefix=frontend -b frontend-only

# Yangi repository yaratish
mkdir ../fastfood-frontend-deploy
cd ../fastfood-frontend-deploy
git init
git pull ../delivery frontend-only

# GitHub ga push
git remote add origin https://github.com/YOUR_USERNAME/fastfood-frontend.git
git push -u origin main
```

### Backend ni ajratish

```bash
cd delivery

# Backend uchun yangi branch yaratish
git subtree split --prefix=backend -b backend-only

# Yangi repository yaratish
mkdir ../fastfood-backend-deploy
cd ../fastfood-backend-deploy
git init
git pull ../delivery backend-only

# GitHub ga push
git remote add origin https://github.com/YOUR_USERNAME/fastfood-backend.git
git push -u origin main
```

---

## Variant 3: Monorepo ni saqlab, Root Directory ishlatish (Eng oson!)

**Ajratish shart emas!** Vercel va Render **Root Directory** sozlamasini qo'llab-quvvatlaydi:

### Frontend → Vercel
1. Vercel da **Root Directory: `frontend`** ni belgilang
2. Vercel faqat `frontend` papkasini deploy qiladi

### Backend → Render
1. Render da **Root Directory: `backend`** ni belgilang
2. Render faqat `backend` papkasini deploy qiladi

**Bu eng oson yo'l!** Yangi repository yaratish shart emas.

---

## 📋 Deploy qilish (Ajratilgandan keyin)

### Frontend (Vercel)
1. GitHub da yangi `fastfood-frontend` repository yarating
2. Vercel da shu repository ni import qiling
3. Root Directory: `/` (chunki endi faqat frontend bor)
4. Deploy qiling

### Backend (Render)
1. GitHub da yangi `fastfood-backend` repository yarating
2. Render da shu repository ni import qiling
3. Root Directory: `/` (chunki endi faqat backend bor)
4. Deploy qiling

---

## ✅ Tavsiya

**Variant 3 ni ishlating** - monorepo ni saqlab, Root Directory ishlatish.

Sabab:
- Yangi repository yaratish shart emas
- Kod bir joyda qoladi
- Deploy oson
- Vercel va Render qo'llab-quvvatlaydi

Agar baribir ajratmoqchi bo'lsangiz, **Variant 1** eng oson va tushunarli.
