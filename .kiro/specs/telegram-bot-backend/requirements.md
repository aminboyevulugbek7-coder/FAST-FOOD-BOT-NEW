# Fast Food Bagat Telegram Bot Backend - Requirements

## Overview

Fast Food Bagat uchun Telegram bot backend tizimi - bu foydalanuvchilarga Telegram orqali ovqat buyurtma qilish imkonini beruvchi to'liq funksional backend tizimi. Tizim NestJS framework asosida quriladi va Firebase ma'lumotlar bazasidan foydalanadi.

## Requirement 1

**User Story:** Foydalanuvchi sifatida, men Telegram bot orqali ro'yxatdan o'tishim va profilimni boshqarishim kerak, shunda tizimda identifikatsiya qilinaman va buyurtmalarimni kuzatib borishim mumkin.

### Acceptance Criteria

1.1. WHEN foydalanuvchi botga /start komandasi yuborsa THEN tizim foydalanuvchini Firebase'da yaratishi yoki mavjud foydalanuvchini topishi KERAK

1.2. WHEN foydalanuvchi telefon raqamini ulashsa THEN tizim telefon raqamini validatsiya qilishi va saqlashi KERAK

1.3. WHEN foydalanuvchi ismini kiritsa THEN tizim ismni saqlashi va profil yaratishni yakunlashi KERAK

1.4. WHEN foydalanuvchi /profile komandasi yuborsa THEN tizim foydalanuvchi ma'lumotlarini (ism, telefon, buyurtmalar soni) ko'rsatishi KERAK

1.5. WHEN foydalanuvchi profilini tahrirlashni xohlasa THEN tizim ism va telefon raqamini yangilash imkonini berishi KERAK

## Requirement 2

**User Story:** Foydalanuvchi sifatida, men mahsulotlar katalogini ko'rishim va kategoriyalar bo'yicha qidirishim kerak, shunda kerakli mahsulotni tez topishim mumkin.

### Acceptance Criteria

2.1. WHEN foydalanuvchi "Menyu" tugmasini bossa THEN tizim barcha mavjud kategoriyalarni inline keyboard sifatida ko'rsatishi KERAK

2.2. WHEN foydalanuvchi kategoriyani tanlasa THEN tizim shu kategoriyaga tegishli barcha mahsulotlarni rasm, narx va tavsif bilan ko'rsatishi KERAK

2.3. WHEN mahsulot mavjud bo'lmasa THEN tizim "Mahsulot mavjud emas" xabarini ko'rsatishi KERAK

2.4. WHEN foydalanuvchi mahsulotni tanlasa THEN tizim mahsulot tafsilotlarini va "Savatga qo'shish" tugmasini ko'rsatishi KERAK

2.5. WHEN mahsulotlar ro'yxati 10 tadan ko'p bo'lsa THEN tizim pagination qo'llashi KERAK

## Requirement 3

**User Story:** Foydalanuvchi sifatida, men mahsulotlarni savatga qo'shishim va savatni boshqarishim kerak, shunda buyurtma berishdan oldin tanlovlarimni ko'rib chiqishim mumkin.

### Acceptance Criteria

3.1. WHEN foydalanuvchi "Savatga qo'shish" tugmasini bossa THEN tizim mahsulotni savatga qo'shishi va miqdorni so'rashi KERAK

3.2. WHEN foydalanuvchi miqdorni kiritsa THEN tizim miqdorni validatsiya qilishi (1-99 oralig'ida) va savatni yangilashi KERAK

3.3. WHEN foydalanuvchi /cart komandasi yuborsa THEN tizim savat tarkibini mahsulot nomlari, miqdorlar va umumiy narx bilan ko'rsatishi KERAK

3.4. WHEN savat bo'sh bo'lsa THEN tizim "Savat bo'sh" xabarini ko'rsatishi KERAK

3.5. WHEN foydalanuvchi savatdan mahsulotni o'chirmoqchi bo'lsa THEN tizim mahsulotni o'chirish va miqdorni o'zgartirish imkonini berishi KERAK

3.6. WHEN foydalanuvchi savatni tozalamoqchi bo'lsa THEN tizim tasdiqlash so'rovi yuborishi va tasdiqlangandan keyin savatni tozalashi KERAK

## Requirement 4

**User Story:** Foydalanuvchi sifatida, men buyurtma berishim va yetkazib berish ma'lumotlarini kiritishim kerak, shunda buyurtmam muvaffaqiyatli qayd qilinsin.

### Acceptance Criteria

4.1. WHEN foydalanuvchi "Buyurtma berish" tugmasini bossa THEN tizim yetkazib berish turini tanlashni so'rashi KERAK (yetkazib berish yoki olib ketish)

4.2. WHEN foydalanuvchi "Yetkazib berish" ni tanlasa THEN tizim manzilni kiritishni so'rashi yoki lokatsiya ulashishni taklif qilishi KERAK

4.3. WHEN foydalanuvchi manzilni kiritsa THEN tizim manzilni validatsiya qilishi va saqlashi KERAK

4.4. WHEN foydalanuvchi to'lov turini tanlasa THEN tizim to'lov turini (naqd yoki karta) saqlashi KERAK

4.5. WHEN barcha ma'lumotlar to'ldirilsa THEN tizim buyurtma xulosasini ko'rsatishi va tasdiqlashni so'rashi KERAK

4.6. WHEN foydalanuvchi buyurtmani tasdiqlasa THEN tizim buyurtmani Firebase'da yaratishi va noyob buyurtma raqamini qaytarishi KERAK

4.7. WHEN buyurtma yaratilsa THEN tizim savatni tozalashi va foydalanuvchiga muvaffaqiyat xabarini yuborishi KERAK

## Requirement 5

**User Story:** Foydalanuvchi sifatida, men buyurtmalarim holatini kuzatishim kerak, shunda buyurtmam qayerda ekanligini bilishim mumkin.

### Acceptance Criteria

5.1. WHEN foydalanuvchi /orders komandasi yuborsa THEN tizim oxirgi 5 ta buyurtmani holati bilan ko'rsatishi KERAK

5.2. WHEN foydalanuvchi buyurtmani tanlasa THEN tizim buyurtma tafsilotlarini (mahsulotlar, narx, holat, vaqt) ko'rsatishi KERAK

5.3. WHEN buyurtma holati o'zgarsa THEN tizim foydalanuvchiga bildirishnoma yuborishi KERAK

5.4. WHEN buyurtma "Tayyorlanmoqda" holatida bo'lsa THEN foydalanuvchi buyurtmani bekor qilish imkoniga ega bo'lishi KERAK

5.5. WHEN foydalanuvchi buyurtmani bekor qilsa THEN tizim tasdiqlash so'rovi yuborishi va tasdiqlangandan keyin buyurtma holatini "Bekor qilingan" ga o'zgartirishi KERAK

## Requirement 6

**User Story:** Administrator sifatida, men mahsulotlarni boshqarishim kerak, shunda menyu doimo yangilangan bo'lsin.

### Acceptance Criteria

6.1. WHEN administrator /admin komandasi yuborsa THEN tizim admin panelini (mahsulot qo'shish, tahrirlash, o'chirish) ko'rsatishi KERAK

6.2. WHEN administrator mahsulot qo'shmoqchi bo'lsa THEN tizim mahsulot ma'lumotlarini (nom, narx, kategoriya, tavsif, rasm) kiritishni so'rashi KERAK

6.3. WHEN administrator mahsulot ma'lumotlarini kiritsa THEN tizim ma'lumotlarni validatsiya qilishi va Firebase'da saqlashi KERAK

6.4. WHEN administrator mahsulotni tahrirlasa THEN tizim yangi ma'lumotlarni saqlashi va keshni yangilashi KERAK

6.5. WHEN administrator mahsulotni o'chirsa THEN tizim tasdiqlash so'rovi yuborishi va tasdiqlangandan keyin mahsulotni "o'chirilgan" deb belgilashi KERAK (soft delete)

## Requirement 7

**User Story:** Administrator sifatida, men buyurtmalarni boshqarishim va holatlarini yangilashim kerak, shunda buyurtmalar jarayonini nazorat qilishim mumkin.

### Acceptance Criteria

7.1. WHEN administrator yangi buyurtma kelsa THEN tizim administratorga bildirishnoma yuborishi KERAK

7.2. WHEN administrator /pending komandasi yuborsa THEN tizim barcha "Kutilmoqda" holatidagi buyurtmalarni ko'rsatishi KERAK

7.3. WHEN administrator buyurtmani tanlasa THEN tizim buyurtma tafsilotlarini va holat o'zgartirish tugmalarini ko'rsatishi KERAK

7.4. WHEN administrator buyurtma holatini o'zgartirsa THEN tizim holatni Firebase'da yangilashi va foydalanuvchiga bildirishnoma yuborishi KERAK

7.5. WHEN administrator buyurtmani "Yetkazildi" holatiga o'tkazsa THEN tizim buyurtmani yakunlangan deb belgilashi va statistikaga qo'shishi KERAK

## Requirement 8

**User Story:** Tizim arxitekti sifatida, men tizimning modulli va kengaytiriladigan bo'lishini xohlayman, shunda yangi funksiyalarni qo'shish oson bo'lsin.

### Acceptance Criteria

8.1. WHEN yangi bot komandasi qo'shilsa THEN tizim mavjud kodga minimal ta'sir ko'rsatishi KERAK

8.2. WHEN yangi to'lov usuli qo'shilsa THEN tizim Strategy pattern orqali osongina integratsiya qilishi KERAK

8.3. WHEN yangi yetkazib berish xizmati qo'shilsa THEN tizim mavjud yetkazib berish logikasiga ta'sir qilmasdan qo'shilishi KERAK

8.4. WHEN tizim xatolik yuz bersa THEN tizim xatolikni to'g'ri qayta ishlashi va foydalanuvchiga tushunarli xabar yuborishi KERAK

8.5. WHEN tizim yuklama oshsa THEN tizim keshlash va optimizatsiya mexanizmlari orqali samaradorlikni saqlashi KERAK

## Requirement 9

**User Story:** Tizim ma'muri sifatida, men tizim xavfsizligini ta'minlashim kerak, shunda foydalanuvchi ma'lumotlari himoyalangan bo'lsin.

### Acceptance Criteria

9.1. WHEN foydalanuvchi admin komandalarini yuborsa THEN tizim foydalanuvchining admin ekanligini tekshirishi KERAK

9.2. WHEN tizim Firebase bilan aloqa qilsa THEN tizim xavfsiz autentifikatsiya mexanizmlaridan foydalanishi KERAK

9.3. WHEN tizim xatolik yuz bersa THEN tizim maxfiy ma'lumotlarni (API kalitlar, parollar) logga yozmasligi KERAK

9.4. WHEN foydalanuvchi ma'lumotlari saqlanasa THEN tizim ma'lumotlarni shifrlangan holda saqlashi KERAK

9.5. WHEN tizim rate limiting qo'llasa THEN tizim har bir foydalanuvchi uchun so'rovlar sonini cheklashi KERAK (10 so'rov/daqiqa)

## Requirement 10

**User Story:** Dasturchi sifatida, men tizim loglarini ko'rishim va xatolarni tuzatishim kerak, shunda muammolarni tez aniqlashim mumkin.

### Acceptance Criteria

10.1. WHEN tizimda xatolik yuz bersa THEN tizim xatolik ma'lumotlarini (stack trace, context) logga yozishi KERAK

10.2. WHEN foydalanuvchi buyurtma bersa THEN tizim buyurtma ma'lumotlarini logga yozishi KERAK

10.3. WHEN tizim Firebase bilan aloqa qilsa THEN tizim so'rov va javob ma'lumotlarini logga yozishi KERAK

10.4. WHEN loglar yozilsa THEN tizim log darajalarini (info, warn, error) to'g'ri qo'llashi KERAK

10.5. WHEN loglar hajmi katta bo'lsa THEN tizim eski loglarni avtomatik tozalashi yoki arxivlashi KERAK
