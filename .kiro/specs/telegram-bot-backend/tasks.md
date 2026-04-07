# Implementation Plan: Fast Food Bagat Telegram Bot Backend

## Overview

Bu implementation plan NestJS framework asosida Telegram bot backend tizimini yaratish uchun mo'ljallangan. Tizim Firebase ma'lumotlar bazasi va Telegraf kutubxonasi yordamida Telegram Bot API bilan integratsiya qilinadi. Har bir task oldingi tasklarga asoslanadi va kod yozish, o'zgartirish yoki test qilish bilan bog'liq.

## Tasks

- [x] 1. NestJS loyihasi va asosiy konfiguratsiyani sozlash
  - NestJS CLI orqali yangi loyiha yaratish
  - Kerakli dependencies o'rnatish (telegraf, firebase-admin, class-validator, class-transformer, cache-manager)
  - Environment variables konfiguratsiyasi (.env file)
  - TypeScript konfiguratsiyasi (tsconfig.json)
  - _Requirements: 8.1, 8.5_

- [x] 2. Firebase integratsiyasi va asosiy modullarni yaratish
  - [x] 2.1 Firebase module va service yaratish
    - Firebase Admin SDK ni sozlash
    - FirebaseService yaratish (Firestore, Storage, Auth)
    - Firebase konfiguratsiya faylini yaratish
    - _Requirements: 9.2, 9.4_


  - [ ]* 2.2 Firebase service uchun unit testlar yozish
    - Firestore CRUD operatsiyalari uchun testlar
    - Error handling testlari
    - _Requirements: 9.2_

- [-] 3. Common utilities va middleware yaratish
  - [ ] 3.1 Exception filters yaratish
    - BotExceptionFilter (bot xatoliklarini qayta ishlash)
    - FirebaseExceptionFilter (Firebase xatoliklarini qayta ishlash)
    - _Requirements: 8.4, 9.3_

  - [ ] 3.2 Guards va decorators yaratish
    - AdminGuard (admin huquqlarini tekshirish)
    - RateLimitGuard (so'rovlar sonini cheklash)
    - @Admin() va @User() decorators
    - _Requirements: 9.1, 9.5_

  - [x] 3.3 Logging interceptor va utility yaratish
    - LoggingInterceptor (barcha so'rovlarni loglash)
    - Logger utility (log darajalari bilan)
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [ ]* 3.4 Common utilities uchun unit testlar
    - Exception filters testlari
    - Guards testlari
    - _Requirements: 8.4, 9.1_

- [x] 4. Users module yaratish
  - [x] 4.1 User entity va DTOs yaratish
    - User entity (id, telegramId, firstName, lastName, phone, isAdmin)
    - CreateUserDto va UpdateUserDto (validation bilan)
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 4.2 UsersRepository yaratish
    - Firebase Firestore bilan CRUD operatsiyalar
    - findByTelegramId, findById, create, update metodlari
    - _Requirements: 1.1, 1.5_

  - [x] 4.3 UsersService yaratish
    - Foydalanuvchi yaratish va yangilash logikasi
    - Admin tekshirish metodi
    - Telefon raqam validatsiyasi
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 9.1_

  - [ ]* 4.4 Users module uchun unit testlar
    - UsersService metodlari uchun testlar
    - Validation testlari
    - _Requirements: 1.1, 1.2, 1.3_

- [ ] 5. Products module yaratish
  - [ ] 5.1 Product entity va DTOs yaratish
    - Product entity (id, name, description, price, category, imageUrl, isAvailable, isDeleted)
    - CreateProductDto va UpdateProductDto (validation bilan)
    - _Requirements: 2.1, 2.2, 6.2, 6.3_

  - [ ] 5.2 ProductsRepository yaratish
    - Firebase Firestore bilan CRUD operatsiyalar
    - findByCategory, findAll, findById, create, update, softDelete metodlari
    - _Requirements: 2.1, 2.2, 6.3, 6.4, 6.5_

  - [ ] 5.3 ProductsService yaratish
    - Mahsulotlar ro'yxatini olish (keshlash bilan)
    - Kategoriyalar bo'yicha filtrlash
    - Pagination logikasi
    - Soft delete implementatsiyasi
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 6.3, 6.4, 6.5, 8.5_

  - [ ]* 5.4 Products module uchun unit testlar
    - ProductsService metodlari uchun testlar
    - Keshlash testlari
    - Pagination testlari
    - _Requirements: 2.1, 2.2, 2.5_

- [ ] 6. Cart module yaratish
  - [ ] 6.1 Cart entity yaratish
    - Cart entity (userId, items: CartItem[])
    - CartItem (productId, quantity, addedAt)
    - _Requirements: 3.1, 3.2_

  - [ ] 6.2 CartService yaratish
    - addItem, removeItem, updateQuantity metodlari
    - getCart, clearCart, calculateTotal metodlari
    - Miqdor validatsiyasi (1-99 oralig'i)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [ ]* 6.3 Cart module uchun unit testlar
    - CartService metodlari uchun testlar
    - Miqdor validatsiyasi testlari
    - _Requirements: 3.1, 3.2_

- [ ] 7. Checkpoint - Asosiy modullar testlari
  - Ensure all tests pass, ask the user if questions arise.


- [ ] 8. Strategy pattern implementatsiyalari
  - [ ] 8.1 Payment strategy yaratish
    - PaymentStrategy interface
    - CashPaymentStrategy implementatsiyasi
    - CardPaymentStrategy implementatsiyasi
    - PaymentService (strategy pattern bilan)
    - _Requirements: 4.4, 8.2_

  - [ ] 8.2 Delivery strategy yaratish
    - DeliveryStrategy interface
    - HomeDeliveryStrategy implementatsiyasi (yetkazib berish narxini hisoblash)
    - PickupStrategy implementatsiyasi
    - DeliveryService (strategy pattern bilan)
    - _Requirements: 4.1, 4.2, 8.3_

  - [ ] 8.3 Notification strategy yaratish
    - NotificationStrategy interface
    - UserNotificationStrategy implementatsiyasi
    - AdminNotificationStrategy implementatsiyasi
    - NotificationsService (strategy pattern bilan)
    - _Requirements: 5.3, 7.1, 7.4_

  - [ ]* 8.4 Strategy pattern uchun unit testlar
    - Har bir strategy uchun testlar
    - Strategy selection testlari
    - _Requirements: 8.2, 8.3_

- [ ] 9. Orders module yaratish
  - [ ] 9.1 Order entity va DTOs yaratish
    - Order entity (id, orderNumber, userId, items, totalAmount, deliveryType, deliveryAddress, deliveryFee, paymentType, status)
    - OrderStatus, DeliveryType, PaymentType enums
    - CreateOrderDto va UpdateOrderDto
    - _Requirements: 4.5, 4.6, 5.1, 5.2_

  - [ ] 9.2 OrdersRepository yaratish
    - Firebase Firestore bilan CRUD operatsiyalar
    - findByUserId, findPendingOrders, findById, create, updateStatus metodlari
    - _Requirements: 4.6, 5.1, 5.2, 7.2_

  - [ ] 9.3 OrdersService yaratish
    - Buyurtma yaratish logikasi (payment va delivery strategiyalar bilan)
    - Buyurtma raqami generatsiyasi
    - Umumiy narxni hisoblash (mahsulotlar + yetkazib berish)
    - Buyurtma holatini yangilash
    - Buyurtmani bekor qilish (faqat "Tayyorlanmoqda" holatida)
    - _Requirements: 4.5, 4.6, 4.7, 5.1, 5.2, 5.4, 5.5, 7.4, 7.5_

  - [ ]* 9.4 Orders module uchun unit testlar
    - OrdersService metodlari uchun testlar
    - Buyurtma yaratish va bekor qilish testlari
    - _Requirements: 4.6, 5.5_

- [-] 10. Telegraf bot asosiy konfiguratsiyasi
  - [x] 10.1 Bot module va asosiy update handler yaratish
    - BotModule yaratish
    - BotUpdate class (asosiy handler)
    - Session middleware sozlash
    - Stage (scenes) sozlash
    - _Requirements: 1.1, 8.1_

  - [ ] 10.2 Keyboards yaratish
    - MainKeyboard (asosiy menyu)
    - MenuKeyboard (kategoriyalar va mahsulotlar)
    - CartKeyboard (savat boshqaruvi)
    - AdminKeyboard (admin panel)
    - _Requirements: 2.1, 3.3, 6.1, 7.2_

  - [ ] 10.3 Middleware yaratish
    - SessionMiddleware (session boshqaruvi)
    - AuthMiddleware (foydalanuvchi autentifikatsiyasi)
    - RateLimitMiddleware (so'rovlar cheklash)
    - _Requirements: 9.1, 9.5_

- [ ] 11. Bot commands implementatsiyasi
  - [x] 11.1 /start command yaratish
    - Foydalanuvchini tekshirish (mavjud yoki yangi)
    - Yangi foydalanuvchi uchun registration scene ga yo'naltirish
    - Mavjud foydalanuvchi uchun asosiy menyuni ko'rsatish
    - _Requirements: 1.1_

  - [x] 11.2 /profile command yaratish
    - Foydalanuvchi ma'lumotlarini ko'rsatish
    - Profil tahrirlash tugmalarini qo'shish
    - _Requirements: 1.4, 1.5_

  - [ ] 11.3 /cart command yaratish
    - Savat tarkibini ko'rsatish
    - Umumiy narxni hisoblash
    - Savat boshqaruvi tugmalarini qo'shish
    - _Requirements: 3.3, 3.4_

  - [ ] 11.4 /orders command yaratish
    - Foydalanuvchi buyurtmalarini ko'rsatish (oxirgi 5 ta)
    - Buyurtma tafsilotlarini ko'rish imkonini berish
    - _Requirements: 5.1, 5.2_

  - [ ] 11.5 /admin command yaratish (AdminGuard bilan)
    - Admin panelini ko'rsatish
    - Mahsulot va buyurtma boshqaruvi tugmalarini qo'shish
    - _Requirements: 6.1, 7.2, 9.1_


- [ ] 12. Bot scenes - Foydalanuvchi uchun
  - [x] 12.1 Registration scene yaratish
    - Telefon raqamini so'rash (contact button)
    - Ismni so'rash
    - Foydalanuvchini Firebase'da yaratish
    - Asosiy menyuga yo'naltirish
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 12.2 Menu scene yaratish
    - Kategoriyalarni ko'rsatish
    - Tanlangan kategoriya bo'yicha mahsulotlarni ko'rsatish
    - Mahsulot tafsilotlarini ko'rsatish
    - Pagination qo'llash (10 tadan ko'p mahsulot uchun)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [ ] 12.3 Cart scene yaratish
    - Mahsulotni savatga qo'shish
    - Miqdorni so'rash va validatsiya qilish
    - Savatdan mahsulotni o'chirish
    - Miqdorni o'zgartirish
    - Savatni tozalash (tasdiqlash bilan)
    - _Requirements: 3.1, 3.2, 3.5, 3.6_

  - [ ] 12.4 Checkout scene yaratish
    - Yetkazib berish turini tanlash (home/pickup)
    - Manzilni kiritish yoki lokatsiya ulashish
    - To'lov turini tanlash (cash/card)
    - Buyurtma xulosasini ko'rsatish
    - Buyurtmani tasdiqlash va yaratish
    - Savatni tozalash
    - Muvaffaqiyat xabarini yuborish
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

  - [ ] 12.5 Orders scene yaratish
    - Foydalanuvchi buyurtmalarini ko'rsatish
    - Buyurtma tafsilotlarini ko'rsatish
    - Buyurtmani bekor qilish (faqat "Tayyorlanmoqda" holatida)
    - _Requirements: 5.1, 5.2, 5.4, 5.5_

- [ ] 13. Bot scenes - Administrator uchun
  - [ ] 13.1 Product Add scene yaratish
    - Mahsulot nomini so'rash
    - Tavsifni so'rash
    - Narxni so'rash va validatsiya qilish
    - Kategoriyani tanlash
    - Rasm URL ni so'rash
    - Mahsulotni Firebase'da yaratish
    - _Requirements: 6.2, 6.3_

  - [ ] 13.2 Product Edit scene yaratish
    - Mahsulotni tanlash
    - Yangilanadigan maydonni tanlash
    - Yangi qiymatni kiritish
    - Mahsulotni yangilash va keshni tozalash
    - _Requirements: 6.4_

  - [ ] 13.3 Product Delete scene yaratish
    - Mahsulotni tanlash
    - Tasdiqlash so'rovi
    - Soft delete qo'llash
    - _Requirements: 6.5_

  - [ ] 13.4 Order Management scene yaratish
    - Kutilayotgan buyurtmalarni ko'rsatish
    - Buyurtma tafsilotlarini ko'rsatish
    - Buyurtma holatini o'zgartirish
    - Foydalanuvchiga bildirishnoma yuborish
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 14. Checkpoint - Bot funksiyalari testlari
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 15. Real-time bildirishnomalar va event handling
  - [ ] 15.1 Order status change event handler
    - Buyurtma holati o'zgarganda foydalanuvchiga xabar yuborish
    - Yangi buyurtma kelganda administratorga xabar yuborish
    - _Requirements: 5.3, 7.1, 7.4_

  - [ ] 15.2 Product availability change handler
    - Mahsulot mavjud bo'lmaganda foydalanuvchiga xabar berish
    - _Requirements: 2.3_

  - [ ]* 15.3 Event handlers uchun integration testlar
    - Bildirishnoma yuborish testlari
    - Event handling testlari
    - _Requirements: 5.3, 7.1_

- [ ] 16. Xavfsizlik va optimizatsiya
  - [ ] 16.1 Rate limiting implementatsiyasi
    - RateLimitGuard ni barcha endpointlarga qo'llash
    - 10 so'rov/daqiqa cheklash
    - _Requirements: 9.5_

  - [ ] 16.2 Keshlash mexanizmi
    - Mahsulotlar ro'yxatini keshlash
    - Kategoriyalarni keshlash
    - Cache invalidation logikasi
    - _Requirements: 8.5_

  - [ ] 16.3 Ma'lumotlar shifrlash
    - Telefon raqamlarini shifrlash
    - Maxfiy ma'lumotlarni logga yozmaslik
    - _Requirements: 9.3, 9.4_

  - [ ]* 16.4 Xavfsizlik testlari
    - Rate limiting testlari
    - Admin guard testlari
    - _Requirements: 9.1, 9.5_


- [ ] 17. Logging va monitoring
  - [ ] 17.1 Logging tizimini sozlash
    - Winston yoki Pino logger integratsiyasi
    - Log darajalari (info, warn, error) sozlash
    - Log fayllarini yaratish va rotatsiya
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [ ] 17.2 Error tracking
    - Global exception filter
    - Stack trace logging
    - Context ma'lumotlarini loglash
    - _Requirements: 10.1_

  - [ ] 17.3 Log tozalash mexanizmi
    - Eski loglarni avtomatik o'chirish yoki arxivlash
    - Log hajmini cheklash
    - _Requirements: 10.5_

  - [ ]* 17.4 Logging testlari
    - Logger metodlari uchun testlar
    - Log darajalari testlari
    - _Requirements: 10.4_

- [ ] 18. Integration va wiring
  - [ ] 18.1 Barcha modullarni AppModule ga ulash
    - BotModule, UsersModule, ProductsModule, OrdersModule, CartModule
    - FirebaseModule, NotificationsModule, PaymentModule, DeliveryModule
    - Global pipes, filters, interceptors sozlash
    - _Requirements: 8.1_

  - [ ] 18.2 Environment variables va konfiguratsiya
    - ConfigModule sozlash
    - Barcha environment variables ni tekshirish
    - Production va development konfiguratsiyalari
    - _Requirements: 9.2_

  - [ ] 18.3 Main.ts ni sozlash
    - NestJS application yaratish
    - Global middleware qo'llash
    - Bot ni ishga tushirish
    - Graceful shutdown
    - _Requirements: 8.1_

  - [ ]* 18.4 Integration testlar
    - End-to-end bot flow testlari
    - Barcha modullar integratsiyasi testlari
    - _Requirements: 8.1_

- [ ] 19. Documentation va deployment tayyorlash
  - [ ] 19.1 README.md yaratish
    - Loyiha tavsifi
    - O'rnatish yo'riqnomasi
    - Environment variables ro'yxati
    - Ishga tushirish ko'rsatmalari
    - _Requirements: 8.1_

  - [ ] 19.2 API documentation
    - Bot commands ro'yxati
    - Scene flow diagrammalari
    - Error codes va xabarlar
    - _Requirements: 8.1_

  - [ ] 19.3 Deployment skriptlari
    - Docker Dockerfile yaratish
    - docker-compose.yml yaratish
    - PM2 ecosystem file (agar kerak bo'lsa)
    - _Requirements: 8.1_

- [ ] 20. Final checkpoint - Barcha testlar va deployment
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- `*` belgisi bilan belgilangan tasklar optional va MVP uchun o'tkazib yuborilishi mumkin
- Har bir task aniq requirements ga havola qiladi
- Checkpointlar orqali incremential validatsiya ta'minlanadi
- Strategy pattern orqali tizim kengaytiriladigan bo'ladi
- Firebase bilan barcha integratsiyalar xavfsiz autentifikatsiya orqali amalga oshiriladi
- Logging va monitoring orqali tizim holatini kuzatish mumkin
