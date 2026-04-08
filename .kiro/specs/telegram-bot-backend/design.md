# Fast Food Bagat Telegram Bot Backend - Technical Design

## Overview

Fast Food Bagat Telegram bot backend tizimi - bu NestJS framework asosida qurilgan, Firebase ma'lumotlar bazasidan foydalanadigan va Telegraf kutubxonasi orqali Telegram Bot API bilan integratsiya qilingan to'liq funksional backend tizimi.

Tizim quyidagi asosiy funksiyalarni ta'minlaydi:
- Foydalanuvchi ro'yxatdan o'tishi va profil boshqaruvi
- Mahsulotlar katalogi va qidiruv
- Savat boshqaruvi
- Buyurtma berish va kuzatish
- Administrator paneli (mahsulot va buyurtma boshqaruvi)
- Real-time bildirishnomalar
- Xavfsizlik va logging

## Architecture

### High-Level Architecture

Tizim quyidagi asosiy qatlamlardan iborat:

```
┌─────────────────────────────────────────────────────────┐
│                    Telegram Bot API                      │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                  Bot Layer (Telegraf)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Commands   │  │    Scenes    │  │  Middleware  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              Application Layer (NestJS)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Controllers │  │   Services   │  │   Guards     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│               Data Layer (Firebase)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Firestore   │  │   Storage    │  │     Auth     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### NestJS Module Structure

```
src/
├── app.module.ts                 # Root module
├── main.ts                       # Application entry point
│
├── bot/                          # Bot module
│   ├── bot.module.ts
│   ├── bot.update.ts             # Main bot update handler
│   ├── commands/                 # Command handlers
│   │   ├── start.command.ts
│   │   ├── profile.command.ts
│   │   ├── cart.command.ts
│   │   ├── orders.command.ts
│   │   └── admin.command.ts
│   ├── scenes/                   # Conversation scenes
│   │   ├── registration.scene.ts
│   │   ├── menu.scene.ts
│   │   ├── cart.scene.ts
│   │   ├── checkout.scene.ts
│   │   └── admin/
│   │       ├── product-add.scene.ts
│   │       ├── product-edit.scene.ts
│   │       └── order-manage.scene.ts
│   ├── keyboards/                # Inline keyboards
│   │   ├── main.keyboard.ts
│   │   ├── menu.keyboard.ts
│   │   ├── cart.keyboard.ts
│   │   └── admin.keyboard.ts
│   └── middleware/
│       ├── session.middleware.ts
│       ├── auth.middleware.ts
│       └── rate-limit.middleware.ts
│
├── users/                        # Users module
│   ├── users.module.ts
│   ├── users.service.ts
│   ├── users.repository.ts
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   └── update-user.dto.ts
│   └── entities/
│       └── user.entity.ts
│
├── products/                     # Products module
│   ├── products.module.ts
│   ├── products.service.ts
│   ├── products.repository.ts
│   ├── dto/
│   │   ├── create-product.dto.ts
│   │   └── update-product.dto.ts
│   └── entities/
│       └── product.entity.ts
│
├── orders/                       # Orders module
│   ├── orders.module.ts
│   ├── orders.service.ts
│   ├── orders.repository.ts
│   ├── dto/
│   │   ├── create-order.dto.ts
│   │   └── update-order.dto.ts
│   └── entities/
│       └── order.entity.ts
│
├── cart/                         # Cart module
│   ├── cart.module.ts
│   ├── cart.service.ts
│   └── entities/
│       └── cart.entity.ts
│
├── notifications/                # Notifications module
│   ├── notifications.module.ts
│   ├── notifications.service.ts
│   └── strategies/
│       ├── notification.strategy.ts
│       ├── user-notification.strategy.ts
│       └── admin-notification.strategy.ts
│
├── payment/                      # Payment module
│   ├── payment.module.ts
│   ├── payment.service.ts
│   └── strategies/
│       ├── payment.strategy.ts
│       ├── cash-payment.strategy.ts
│       └── card-payment.strategy.ts
│
├── delivery/                     # Delivery module
│   ├── delivery.module.ts
│   ├── delivery.service.ts
│   └── strategies/
│       ├── delivery.strategy.ts
│       ├── home-delivery.strategy.ts
│       └── pickup.strategy.ts
│
├── firebase/                     # Firebase module
│   ├── firebase.module.ts
│   ├── firebase.service.ts
│   └── config/
│       └── firebase.config.ts
│
├── common/                       # Common utilities
│   ├── decorators/
│   │   ├── admin.decorator.ts
│   │   └── user.decorator.ts
│   ├── filters/
│   │   ├── bot-exception.filter.ts
│   │   └── firebase-exception.filter.ts
│   ├── guards/
│   │   ├── admin.guard.ts
│   │   └── rate-limit.guard.ts
│   ├── interceptors/
│   │   ├── logging.interceptor.ts
│   │   └── cache.interceptor.ts
│   ├── pipes/
│   │   └── validation.pipe.ts
│   └── utils/
│       ├── logger.util.ts
│       ├── validator.util.ts
│       └── formatter.util.ts
│
└── config/                       # Configuration
    ├── app.config.ts
    ├── bot.config.ts
    └── database.config.ts
```

## Components and Interfaces

### Bot Layer Components

#### 1. BotUpdate (Main Handler)

```typescript
@Update()
export class BotUpdate {
  constructor(
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
    private readonly ordersService: OrdersService,
    private readonly cartService: CartService,
  ) {}

  @Start()
  async onStart(@Ctx() ctx: Context): Promise<void>

  @Command('profile')
  async onProfile(@Ctx() ctx: Context): Promise<void>

  @Command('cart')
  async onCart(@Ctx() ctx: Context): Promise<void>

  @Command('orders')
  async onOrders(@Ctx() ctx: Context): Promise<void>

  @Command('admin')
  @UseGuards(AdminGuard)
  async onAdmin(@Ctx() ctx: Context): Promise<void>
}
```

#### 2. Scene Interfaces

```typescript
// Registration Scene
export class RegistrationScene {
  @SceneEnter()
  async onEnter(@Ctx() ctx: SceneContext): Promise<void>

  @On('contact')
  async onContact(@Ctx() ctx: SceneContext): Promise<void>

  @On('text')
  async onName(@Ctx() ctx: SceneContext): Promise<void>

  @SceneLeave()
  async onLeave(@Ctx() ctx: SceneContext): Promise<void>
}

// Menu Scene
export class MenuScene {
  @SceneEnter()
  async onEnter(@Ctx() ctx: SceneContext): Promise<void>

  @Action(/category_(.+)/)
  async onCategorySelect(@Ctx() ctx: SceneContext): Promise<void>

  @Action(/product_(.+)/)
  async onProductSelect(@Ctx() ctx: SceneContext): Promise<void>

  @Action(/add_to_cart_(.+)/)
  async onAddToCart(@Ctx() ctx: SceneContext): Promise<void>
}

// Checkout Scene
export class CheckoutScene {
  @SceneEnter()
  async onEnter(@Ctx() ctx: SceneContext): Promise<void>

  @Action('delivery_home')
  async onHomeDelivery(@Ctx() ctx: SceneContext): Promise<void>

  @Action('delivery_pickup')
  async onPickup(@Ctx() ctx: SceneContext): Promise<void>

  @On('location')
  async onLocation(@Ctx() ctx: SceneContext): Promise<void>

  @On('text')
  async onAddress(@Ctx() ctx: SceneContext): Promise<void>

  @Action(/payment_(.+)/)
  async onPaymentSelect(@Ctx() ctx: SceneContext): Promise<void>

  @Action('confirm_order')
  async onConfirmOrder(@Ctx() ctx: SceneContext): Promise<void>
}
```

### Service Layer Components

#### 1. UsersService

```typescript
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly logger: Logger,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User>
  async findUserById(userId: string): Promise<User | null>
  async findUserByTelegramId(telegramId: number): Promise<User | null>
  async updateUser(userId: string, dto: UpdateUserDto): Promise<User>
  async getUserOrders(userId: string): Promise<Order[]>
  async isAdmin(telegramId: number): Promise<boolean>
}
```

#### 2. ProductsService

```typescript
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly cacheManager: Cache,
    private readonly logger: Logger,
  ) {}

  async createProduct(dto: CreateProductDto): Promise<Product>
  async findAllProducts(): Promise<Product[]>
  async findProductsByCategory(category: string): Promise<Product[]>
  async findProductById(productId: string): Promise<Product | null>
  async updateProduct(productId: string, dto: UpdateProductDto): Promise<Product>
  async deleteProduct(productId: string): Promise<void>
  async getCategories(): Promise<string[]>
}
```

#### 3. OrdersService

```typescript
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly notificationsService: NotificationsService,
    private readonly paymentService: PaymentService,
    private readonly deliveryService: DeliveryService,
    private readonly logger: Logger,
  ) {}

  async createOrder(dto: CreateOrderDto): Promise<Order>
  async findOrderById(orderId: string): Promise<Order | null>
  async findOrdersByUserId(userId: string): Promise<Order[]>
  async findPendingOrders(): Promise<Order[]>
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order>
  async cancelOrder(orderId: string): Promise<Order>
  async calculateTotal(items: CartItem[]): Promise<number>
}
```

#### 4. CartService

```typescript
export class CartService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly logger: Logger,
  ) {}

  async addItem(userId: string, productId: string, quantity: number): Promise<Cart>
  async removeItem(userId: string, productId: string): Promise<Cart>
  async updateQuantity(userId: string, productId: string, quantity: number): Promise<Cart>
  async getCart(userId: string): Promise<Cart>
  async clearCart(userId: string): Promise<void>
  async calculateTotal(userId: string): Promise<number>
}
```

### Strategy Pattern Implementations

#### 1. Payment Strategy

```typescript
export interface PaymentStrategy {
  processPayment(order: Order): Promise<PaymentResult>
  validatePayment(order: Order): Promise<boolean>
}

export class CashPaymentStrategy implements PaymentStrategy {
  async processPayment(order: Order): Promise<PaymentResult> {
    // Cash payment logic
  }

  async validatePayment(order: Order): Promise<boolean> {
    return true; // Cash always valid
  }
}

export class CardPaymentStrategy implements PaymentStrategy {
  async processPayment(order: Order): Promise<PaymentResult> {
    // Card payment integration logic
  }

  async validatePayment(order: Order): Promise<boolean> {
    // Card validation logic
  }
}

export class PaymentService {
  private strategies: Map<PaymentType, PaymentStrategy>

  constructor() {
    this.strategies = new Map([
      [PaymentType.CASH, new CashPaymentStrategy()],
      [PaymentType.CARD, new CardPaymentStrategy()],
    ])
  }

  async processPayment(order: Order): Promise<PaymentResult> {
    const strategy = this.strategies.get(order.paymentType)
    return strategy.processPayment(order)
  }
}
```

#### 2. Delivery Strategy

```typescript
export interface DeliveryStrategy {
  calculateDeliveryFee(address: string): Promise<number>
  validateAddress(address: string): Promise<boolean>
  estimateDeliveryTime(address: string): Promise<number>
}

export class HomeDeliveryStrategy implements DeliveryStrategy {
  async calculateDeliveryFee(address: string): Promise<number> {
    // Calculate based on distance
  }

  async validateAddress(address: string): Promise<boolean> {
    // Validate address format and coverage
  }

  async estimateDeliveryTime(address: string): Promise<number> {
    // Estimate based on distance and traffic
  }
}

export class PickupStrategy implements DeliveryStrategy {
  async calculateDeliveryFee(address: string): Promise<number> {
    return 0; // No fee for pickup
  }

  async validateAddress(address: string): Promise<boolean> {
    return true; // Always valid
  }

  async estimateDeliveryTime(address: string): Promise<number> {
    return 30; // Fixed 30 minutes
  }
}
```

#### 3. Notification Strategy

```typescript
export interface NotificationStrategy {
  send(recipient: string, message: string): Promise<void>
}

export class UserNotificationStrategy implements NotificationStrategy {
  constructor(private readonly bot: Telegraf) {}

  async send(telegramId: string, message: string): Promise<void> {
    await this.bot.telegram.sendMessage(telegramId, message)
  }
}

export class AdminNotificationStrategy implements NotificationStrategy {
  constructor(
    private readonly bot: Telegraf,
    private readonly adminIds: number[],
  ) {}

  async send(recipient: string, message: string): Promise<void> {
    for (const adminId of this.adminIds) {
      await this.bot.telegram.sendMessage(adminId, message)
    }
  }
}
```

## Data Models

### Firebase Firestore Structure

```
firestore/
├── users/
│   └── {userId}/
│       ├── telegramId: number
│       ├── firstName: string
│       ├── lastName: string
│       ├── phone: string
│       ├── isAdmin: boolean
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── products/
│   └── {productId}/
│       ├── name: string
│       ├── description: string
│       ├── price: number
│       ├── category: string
│       ├── imageUrl: string
│       ├── isAvailable: boolean
│       ├── isDeleted: boolean
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── orders/
│   └── {orderId}/
│       ├── orderNumber: string
│       ├── userId: string
│       ├── items: array<{
│       │   productId: string
│       │   productName: string
│       │   quantity: number
│       │   price: number
│       │ }>
│       ├── totalAmount: number
│       ├── deliveryType: string (home|pickup)
│       ├── deliveryAddress: string
│       ├── deliveryFee: number
│       ├── paymentType: string (cash|card)
│       ├── status: string (pending|preparing|delivering|completed|cancelled)
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── carts/
│   └── {userId}/
│       └── items: array<{
│           productId: string
│           quantity: number
│           addedAt: timestamp
│         }>
│
└── categories/
    └── {categoryId}/
        ├── name: string
        ├── displayOrder: number
        └── isActive: boolean
```

### Entity Definitions

#### User Entity

```typescript
export class User {
  id: string
  telegramId: number
  firstName: string
  lastName?: string
  phone: string
  isAdmin: boolean
  createdAt: Date
  updatedAt: Date
}
```

#### Product Entity

```typescript
export class Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  imageUrl: string
  isAvailable: boolean
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}
```

#### Order Entity

```typescript
export enum OrderStatus {
  PENDING = 'pending',
  PREPARING = 'preparing',
  DELIVERING = 'delivering',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum DeliveryType {
  HOME = 'home',
  PICKUP = 'pickup',
}

export enum PaymentType {
  CASH = 'cash',
  CARD = 'card',
}

export class OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
}

export class Order {
  id: string
  orderNumber: string
  userId: string
  items: OrderItem[]
  totalAmount: number
  deliveryType: DeliveryType
  deliveryAddress?: string
  deliveryFee: number
  paymentType: PaymentType
  status: OrderStatus
  createdAt: Date
  updatedAt: Date
}
```

#### Cart Entity

```typescript
export class CartItem {
  productId: string
  quantity: number
  addedAt: Date
}

export class Cart {
  userId: string
  items: CartItem[]
}
```

### DTO Definitions

#### CreateUserDto

```typescript
export class CreateUserDto {
  @IsNumber()
  telegramId: number

  @IsString()
  @MinLength(2)
  firstName: string

  @IsString()
  @IsOptional()
  lastName?: string

  @IsString()
  @Matches(/^\+998\d{9}$/)
  phone: string
}
```

#### CreateProductDto

```typescript
export class CreateProductDto {
  @IsString()
  @MinLength(3)
  name: string

  @IsString()
  description: string

  @IsNumber()
  @Min(0)
  price: number

  @IsString()
  category: string

  @IsString()
  @IsUrl()
  imageUrl: string
}
```

#### CreateOrderDto

```typescript
export class CreateOrderDto {
  @IsString()
  userId: string

  @IsArray()
  @ValidateNested({ each: true })
  items: OrderItem[]

  @IsEnum(DeliveryType)
  deliveryType: DeliveryType

  @IsString()
  @IsOptional()
  deliveryAddress?: string

  @IsEnum(PaymentType)
  paymentType: PaymentType
}
```

## Bot Flow Diagram

```mermaid
graph TD
    Start[/start command] --> CheckUser{User exists?}
    CheckUser -->|No| RegScene[Registration Scene]
    CheckUser -->|Yes| MainMenu[Main Menu]
    
    RegScene --> RequestPhone[Request Phone]
    RequestPhone --> RequestName[Request Name]
    RequestName --> SaveUser[Save User]
    SaveUser --> MainMenu
    
    MainMenu --> MenuBtn[Menu Button]
    MainMenu --> CartBtn[Cart Button]
    MainMenu --> OrdersBtn[Orders Button]
    MainMenu --> ProfileBtn[Profile Button]
    
    MenuBtn --> MenuScene[Menu Scene]
    MenuScene --> ShowCategories[Show Categories]
    ShowCategories --> SelectCategory[Select Category]
    SelectCategory --> ShowProducts[Show Products]
    ShowProducts --> SelectProduct[Select Product]
    SelectProduct --> AddToCart[Add to Cart]
    AddToCart --> EnterQuantity[Enter Quantity]
    EnterQuantity --> UpdateCart[Update Cart]
    UpdateCart --> MainMenu
    
    CartBtn --> CartScene[Cart Scene]
    CartScene --> ShowCart[Show Cart Items]
    ShowCart --> CartActions{Action?}
    CartActions -->|Remove| RemoveItem[Remove Item]
    CartActions -->|Update| UpdateQty[Update Quantity]
    CartActions -->|Checkout| CheckoutScene[Checkout Scene]
    CartActions -->|Clear| ClearCart[Clear Cart]
    RemoveItem --> ShowCart
    UpdateQty --> ShowCart
    ClearCart --> MainMenu
    
    CheckoutScene --> SelectDelivery[Select Delivery Type]
    SelectDelivery --> DeliveryType{Type?}
    DeliveryType -->|Home| EnterAddress[Enter Address]
    DeliveryType -->|Pickup| SelectPayment[Select Payment]
    EnterAddress --> SelectPayment
    SelectPayment --> ShowSummary[Show Order Summary]
    ShowSummary --> ConfirmOrder{Confirm?}
    ConfirmOrder -->|Yes| CreateOrder[Create Order]
    ConfirmOrder -->|No| MainMenu
    CreateOrder --> SendNotification[Send Notifications]
    SendNotification --> ShowSuccess[Show Success Message]
    ShowSuccess --> MainMenu
    
    OrdersBtn --> OrdersScene[Orders Scene]
    OrdersScene --> ShowOrders[Show User Orders]
    ShowOrders --> SelectOrder[Select Order]
    SelectOrder --> ShowOrderDetails[Show Order Details]
    ShowOrderDetails --> OrderActions{Action?}
    OrderActions -->|Cancel| CancelOrder[Cancel Order]
    OrderActions -->|Back| ShowOrders
    CancelOrder --> ShowOrders
    
    ProfileBtn --> ProfileScene[Profile Scene]
    ProfileScene --> ShowProfile[Show Profile Info]
    ShowProfile --> ProfileActions{Action?}
    ProfileActions -->|Edit| EditProfile[Edit Profile]
    ProfileActions -->|Back| MainMenu
    EditProfile --> ShowProfile
    
    MainMenu --> AdminCmd{Admin?}
    AdminCmd -->|Yes| AdminPanel[Admin Panel]
    AdminCmd -->|No| MainMenu
    
    AdminPanel --> AdminActions{Action?}
    AdminActions -->|Products| ProductMgmt[Product Management]
    AdminActions -->|Orders| OrderMgmt[Order Management]
    AdminActions -->|Back| MainMenu
    
    ProductMgmt --> ProductActions{Action?}
    ProductActions -->|Add| AddProduct[Add Product Scene]
    ProductActions -->|Edit| EditProduct[Edit Product Scene]
    ProductActions -->|Delete| DeleteProduct[Delete Product]
    ProductActions -->|Back| AdminPanel
    
    OrderMgmt --> ShowPending[Show Pending Orders]
    ShowPending --> SelectPendingOrder[Select Order]
    SelectPendingOrder --> UpdateStatus[Update Order Status]
    UpdateStatus --> NotifyUser[Notify User]
    NotifyUser --> ShowPending
```


## Middleware and Exception Filter Design

### Middleware Chain

```typescript
// Session Middleware
@Injectable()
export class SessionMiddleware implements NestMiddleware {
  use(ctx: Context, next: () => Promise<void>) {
    // Initialize session for user
    if (!ctx.session) {
      ctx.session = {
        userId: null,
        cartId: null,
        currentScene: null,
      }
    }
    return next()
  }
}

// Authentication Middleware
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(ctx: Context, next: () => Promise<void>) {
    const telegramId = ctx.from?.id
    if (telegramId) {
      const user = await this.usersService.findUserByTelegramId(telegramId)
      ctx.session.user = user
    }
    return next()
  }
}

// Rate Limit Middleware
@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private requests: Map<number, number[]> = new Map()
  private readonly limit = 10 // 10 requests
  private readonly window = 60000 // per minute

  use(ctx: Context, next: () => Promise<void>) {
    const userId = ctx.from?.id
    if (!userId) return next()

    const now = Date.now()
    const userRequests = this.requests.get(userId) || []
    
    // Remove old requests outside window
    const recentRequests = userRequests.filter(time => now - time < this.window)
    
    if (recentRequests.length >= this.limit) {
      ctx.reply('Juda ko\'p so\'rov yuborildi. Iltimos, biroz kuting.')
      return
    }
    
    recentRequests.push(now)
    this.requests.set(userId, recentRequests)
    
    return next()
  }
}
```

### Exception Filters

```typescript
// Bot Exception Filter
@Catch()
export class BotExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp().getResponse<Context>()
    
    this.logger.error('Bot exception occurred', {
      error: exception.message,
      stack: exception.stack,
      userId: ctx.from?.id,
      chatId: ctx.chat?.id,
    })

    // User-friendly error message
    const message = this.getUserFriendlyMessage(exception)
    ctx.reply(message)
  }

  private getUserFriendlyMessage(exception: any): string {
    if (exception instanceof ValidationException) {
      return 'Kiritilgan ma\'lumotlar noto\'g\'ri. Iltimos, qaytadan urinib ko\'ring.'
    }
    if (exception instanceof NotFoundException) {
      return 'Kechirasiz, ma\'lumot topilmadi.'
    }
    if (exception instanceof UnauthorizedException) {
      return 'Sizda bu amalni bajarish uchun ruxsat yo\'q.'
    }
    return 'Xatolik yuz berdi. Iltimos, keyinroq urinib ko\'ring.'
  }
}

// Firebase Exception Filter
@Catch(FirebaseError)
export class FirebaseExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: FirebaseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp().getResponse<Context>()
    
    this.logger.error('Firebase exception occurred', {
      code: exception.code,
      message: exception.message,
      userId: ctx.from?.id,
    })

    ctx.reply('Ma\'lumotlar bazasi bilan bog\'lanishda xatolik yuz berdi.')
  }
}
```

### Guards

```typescript
// Admin Guard
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp().getRequest<Context>()
    const telegramId = ctx.from?.id

    if (!telegramId) {
      return false
    }

    const isAdmin = await this.usersService.isAdmin(telegramId)
    
    if (!isAdmin) {
      await ctx.reply('Sizda admin huquqlari yo\'q.')
    }

    return isAdmin
  }
}

// Rate Limit Guard
@Injectable()
export class RateLimitGuard implements Can