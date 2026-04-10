# Tasks: Admin Panel & Backend Integration

## 1. Backend Setup & Infrastructure

- [ ] 1.1 Set up Firebase project and configure Firestore
  - [ ] 1.1.1 Create Firebase project in console
  - [ ] 1.1.2 Enable Firestore database
  - [ ] 1.1.3 Enable Firebase Storage
  - [ ] 1.1.4 Generate service account credentials
  - [ ] 1.1.5 Configure environment variables

- [ ] 1.2 Create Firestore collections and indexes
  - [ ] 1.2.1 Create 'admins' collection with email index
  - [ ] 1.2.2 Create 'banners' collection with composite index (isActive, order)
  - [ ] 1.2.3 Create 'categories' collection with indexes (name, isActive+order)
  - [ ] 1.2.4 Create 'products' collection with indexes (categoryId, isActive+categoryId, name)
  - [ ] 1.2.5 Create 'orders' collection with indexes (orderNumber, status+createdAt, createdAt desc)

- [ ] 1.3 Configure Firestore security rules
  - [ ] 1.3.1 Restrict 'admins' collection access
  - [ ] 1.3.2 Configure 'orders' collection rules (public create, admin read/update)
  - [ ] 1.3.3 Configure public read, admin write for products/categories/banners

- [ ] 1.4 Configure Firebase Storage security rules
  - [ ] 1.4.1 Allow public read for all images
  - [ ] 1.4.2 Restrict write to authenticated admins
  - [ ] 1.4.3 Validate file size (max 5MB) and type (image/*)

- [ ] 1.5 Install backend dependencies
  - [ ] 1.5.1 Install firebase-admin, jsonwebtoken, bcryptjs
  - [ ] 1.5.2 Install multer for file uploads
  - [ ] 1.5.3 Install express-validator for validation
  - [ ] 1.5.4 Install winston for logging

## 2. Authentication System

- [ ] 2.1 Create authentication service
  - [ ] 2.1.1 Implement login() method with email/password validation
  - [ ] 2.1.2 Implement verifyToken() method for JWT verification
  - [ ] 2.1.3 Implement hashPassword() using bcrypt (cost factor 12)
  - [ ] 2.1.4 Implement comparePassword() for password verification
  - [ ] 2.1.5 Generate JWT tokens with 24-hour expiration

- [ ] 2.2 Create authentication middleware
  - [ ] 2.2.1 Extract JWT from Authorization header
  - [ ] 2.2.2 Verify token validity and expiration
  - [ ] 2.2.3 Attach admin user to request object
  - [ ] 2.2.4 Return 401 for invalid/expired tokens

- [ ] 2.3 Create authentication routes
  - [ ] 2.3.1 POST /api/auth/login endpoint
  - [ ] 2.3.2 GET /api/auth/me endpoint
  - [ ] 2.3.3 Add input validation for login
  - [ ] 2.3.4 Add error handling

- [ ] 2.4 Create initial admin user
  - [ ] 2.4.1 Create seed script for admin user
  - [ ] 2.4.2 Hash default password
  - [ ] 2.4.3 Save to Firestore 'admins' collection


## 3. File Upload Service

- [ ] 3.1 Create upload service
  - [ ] 3.1.1 Implement uploadImage() method
  - [ ] 3.1.2 Implement validateImage() method (type, size validation)
  - [ ] 3.1.3 Generate unique filenames (timestamp + random string)
  - [ ] 3.1.4 Upload to Firebase Storage with metadata
  - [ ] 3.1.5 Make files publicly accessible
  - [ ] 3.1.6 Return public URL
  - [ ] 3.1.7 Implement deleteImage() method

- [ ] 3.2 Create upload routes
  - [ ] 3.2.1 POST /api/upload endpoint with multer middleware
  - [ ] 3.2.2 Add authentication middleware
  - [ ] 3.2.3 Validate file type and size
  - [ ] 3.2.4 Handle upload errors
  - [ ] 3.2.5 Return image URL in response

## 4. Banner Management

- [ ] 4.1 Create banner service
  - [ ] 4.1.1 Implement createBanner() method
  - [ ] 4.1.2 Implement updateBanner() method
  - [ ] 4.1.3 Implement deleteBanner() method
  - [ ] 4.1.4 Implement getBanners() with filters
  - [ ] 4.1.5 Implement getBannerById() method
  - [ ] 4.1.6 Implement toggleBannerStatus() method
  - [ ] 4.1.7 Add validation for banner data

- [ ] 4.2 Create banner routes
  - [ ] 4.2.1 GET /api/banners endpoint (public)
  - [ ] 4.2.2 POST /api/banners endpoint (protected)
  - [ ] 4.2.3 PUT /api/banners/:id endpoint (protected)
  - [ ] 4.2.4 DELETE /api/banners/:id endpoint (protected)
  - [ ] 4.2.5 Add input validation
  - [ ] 4.2.6 Add error handling

## 5. Category Management

- [ ] 5.1 Create category service
  - [ ] 5.1.1 Implement createCategory() method
  - [ ] 5.1.2 Implement updateCategory() method
  - [ ] 5.1.3 Implement deleteCategory() with product count check
  - [ ] 5.1.4 Implement getCategories() with filters
  - [ ] 5.1.5 Implement getCategoryById() method
  - [ ] 5.1.6 Implement reorderCategories() method
  - [ ] 5.1.7 Implement updateProductCount() helper method
  - [ ] 5.1.8 Add validation for category data

- [ ] 5.2 Create category routes
  - [ ] 5.2.1 GET /api/categories endpoint (public)
  - [ ] 5.2.2 POST /api/categories endpoint (protected)
  - [ ] 5.2.3 PUT /api/categories/:id endpoint (protected)
  - [ ] 5.2.4 DELETE /api/categories/:id endpoint (protected)
  - [ ] 5.2.5 Add input validation
  - [ ] 5.2.6 Add error handling

## 6. Product Management

- [ ] 6.1 Create product service
  - [ ] 6.1.1 Implement createProduct() method with category validation
  - [ ] 6.1.2 Implement updateProduct() method
  - [ ] 6.1.3 Implement deleteProduct() method
  - [ ] 6.1.4 Implement getProducts() with pagination and filters
  - [ ] 6.1.5 Implement getProductById() method
  - [ ] 6.1.6 Implement updateStock() method
  - [ ] 6.1.7 Add validation for product data
  - [ ] 6.1.8 Auto-populate categoryName from category

- [ ] 6.2 Create product routes
  - [ ] 6.2.1 GET /api/products endpoint (public, with pagination)
  - [ ] 6.2.2 GET /api/products/:id endpoint (public)
  - [ ] 6.2.3 POST /api/products endpoint (protected)
  - [ ] 6.2.4 PUT /api/products/:id endpoint (protected)
  - [ ] 6.2.5 DELETE /api/products/:id endpoint (protected)
  - [ ] 6.2.6 Add input validation
  - [ ] 6.2.7 Add error handling

- [ ] 6.3 Update existing product routes
  - [ ] 6.3.1 Migrate from MongoDB to Firestore
  - [ ] 6.3.2 Update mock data to use Firestore
  - [ ] 6.3.3 Test backward compatibility


## 7. Order Management

- [ ] 7.1 Create order service
  - [ ] 7.1.1 Implement createOrder() with product validation
  - [ ] 7.1.2 Implement calculateOrderTotal() helper
  - [ ] 7.1.3 Implement generateOrderNumber() with format "ORD-YYYYMMDD-XXXX"
  - [ ] 7.1.4 Implement updateOrderStatus() with transition validation
  - [ ] 7.1.5 Implement validateStatusTransition() helper
  - [ ] 7.1.6 Implement getOrders() with pagination and filters
  - [ ] 7.1.7 Implement getOrderById() method
  - [ ] 7.1.8 Implement getOrderHistory() method
  - [ ] 7.1.9 Implement cancelOrder() method
  - [ ] 7.1.10 Add validation for order data

- [ ] 7.2 Update order routes
  - [ ] 7.2.1 Migrate existing POST /api/orders to use Firestore
  - [ ] 7.2.2 Update GET /api/orders with pagination and filters (protected)
  - [ ] 7.2.3 Update GET /api/orders/:id endpoint (protected)
  - [ ] 7.2.4 Update PATCH /api/orders/:id/status endpoint (protected)
  - [ ] 7.2.5 Add input validation
  - [ ] 7.2.6 Add error handling
  - [ ] 7.2.7 Test backward compatibility

## 8. Analytics & Reporting

- [ ] 8.1 Create analytics service
  - [ ] 8.1.1 Implement getDashboardMetrics() method
  - [ ] 8.1.2 Implement calculatePreviousPeriodMetrics() helper
  - [ ] 8.1.3 Implement calculateGrowthPercentage() helper
  - [ ] 8.1.4 Implement getOrdersOverTime() with grouping
  - [ ] 8.1.5 Implement getRevenueOverTime() with grouping
  - [ ] 8.1.6 Implement getTopProducts() method
  - [ ] 8.1.7 Implement exportReport() for CSV format
  - [ ] 8.1.8 Implement exportReport() for PDF format
  - [ ] 8.1.9 Add caching for analytics data (5 min TTL)

- [ ] 8.2 Create analytics routes
  - [ ] 8.2.1 GET /api/analytics/dashboard endpoint (protected)
  - [ ] 8.2.2 GET /api/analytics/orders-over-time endpoint (protected)
  - [ ] 8.2.3 GET /api/analytics/revenue-over-time endpoint (protected)
  - [ ] 8.2.4 GET /api/analytics/export endpoint (protected)
  - [ ] 8.2.5 Add date range validation
  - [ ] 8.2.6 Add error handling

## 9. Admin Panel - Setup & Authentication

- [ ] 9.1 Set up admin panel project
  - [ ] 9.1.1 Initialize React + Vite + TypeScript project
  - [ ] 9.1.2 Configure Tailwind CSS
  - [ ] 9.1.3 Install dependencies (react-router-dom, zustand, axios, recharts, date-fns)
  - [ ] 9.1.4 Configure environment variables
  - [ ] 9.1.5 Set up folder structure (pages, components, store, services)

- [ ] 9.2 Create authentication store (Zustand)
  - [ ] 9.2.1 Define AuthStore interface
  - [ ] 9.2.2 Implement login() action
  - [ ] 9.2.3 Implement logout() action
  - [ ] 9.2.4 Implement checkAuth() action
  - [ ] 9.2.5 Store token in localStorage
  - [ ] 9.2.6 Add token to axios default headers

- [ ] 9.3 Create API service
  - [ ] 9.3.1 Configure axios instance with base URL
  - [ ] 9.3.2 Add request interceptor for auth token
  - [ ] 9.3.3 Add response interceptor for error handling
  - [ ] 9.3.4 Create API methods for all endpoints

- [ ] 9.4 Create Login page
  - [ ] 9.4.1 Create login form with email and password inputs
  - [ ] 9.4.2 Add form validation
  - [ ] 9.4.3 Integrate with auth store
  - [ ] 9.4.4 Show error messages
  - [ ] 9.4.5 Redirect to dashboard on success
  - [ ] 9.4.6 Style with Tailwind CSS

- [ ] 9.5 Create Layout component
  - [ ] 9.5.1 Create sidebar navigation
  - [ ] 9.5.2 Create header with user info and logout
  - [ ] 9.5.3 Add navigation links (Dashboard, Banners, Categories, Products, Orders, Analytics)
  - [ ] 9.5.4 Highlight active route
  - [ ] 9.5.5 Make responsive
  - [ ] 9.5.6 Style with Tailwind CSS

- [ ] 9.6 Set up routing
  - [ ] 9.6.1 Configure React Router
  - [ ] 9.6.2 Create protected route wrapper
  - [ ] 9.6.3 Add routes for all pages
  - [ ] 9.6.4 Add redirect logic for authentication


## 10. Admin Panel - Dashboard Page

- [ ] 10.1 Create Dashboard page
  - [ ] 10.1.1 Create metric cards component (total orders, revenue, avg order value)
  - [ ] 10.1.2 Add date range picker
  - [ ] 10.1.3 Fetch dashboard metrics from API
  - [ ] 10.1.4 Create orders over time line chart (using Recharts)
  - [ ] 10.1.5 Create revenue over time bar chart (using Recharts)
  - [ ] 10.1.6 Create top products table
  - [ ] 10.1.7 Add loading states
  - [ ] 10.1.8 Add error handling
  - [ ] 10.1.9 Add refresh button
  - [ ] 10.1.10 Style with Tailwind CSS

## 11. Admin Panel - Banners Page

- [ ] 11.1 Create Banners page
  - [ ] 11.1.1 Fetch banners from API
  - [ ] 11.1.2 Display banner list with image previews
  - [ ] 11.1.3 Add create banner button
  - [ ] 11.1.4 Add edit button per banner
  - [ ] 11.1.5 Add delete button per banner
  - [ ] 11.1.6 Add active/inactive toggle per banner
  - [ ] 11.1.7 Implement drag-and-drop reordering
  - [ ] 11.1.8 Add loading and error states
  - [ ] 11.1.9 Style with Tailwind CSS

- [ ] 11.2 Create Banner modal
  - [ ] 11.2.1 Create modal component with form
  - [ ] 11.2.2 Add title input field
  - [ ] 11.2.3 Add description textarea
  - [ ] 11.2.4 Add image upload with preview
  - [ ] 11.2.5 Add CTA text input
  - [ ] 11.2.6 Add CTA link input (optional)
  - [ ] 11.2.7 Add order number input
  - [ ] 11.2.8 Add active checkbox
  - [ ] 11.2.9 Add form validation
  - [ ] 11.2.10 Integrate with API (create/update)
  - [ ] 11.2.11 Show success/error messages
  - [ ] 11.2.12 Style with Tailwind CSS

## 12. Admin Panel - Categories Page

- [ ] 12.1 Create Categories page
  - [ ] 12.1.1 Fetch categories from API
  - [ ] 12.1.2 Display category grid with images
  - [ ] 12.1.3 Show product count per category
  - [ ] 12.1.4 Add create category button
  - [ ] 12.1.5 Add edit button per category
  - [ ] 12.1.6 Add delete button per category (with validation)
  - [ ] 12.1.7 Add active/inactive toggle per category
  - [ ] 12.1.8 Implement reordering functionality
  - [ ] 12.1.9 Add loading and error states
  - [ ] 12.1.10 Style with Tailwind CSS

- [ ] 12.2 Create Category modal
  - [ ] 12.2.1 Create modal component with form
  - [ ] 12.2.2 Add name input field
  - [ ] 12.2.3 Add description textarea
  - [ ] 12.2.4 Add image upload with preview
  - [ ] 12.2.5 Add order number input
  - [ ] 12.2.6 Add active checkbox
  - [ ] 12.2.7 Add form validation
  - [ ] 12.2.8 Integrate with API (create/update)
  - [ ] 12.2.9 Show success/error messages
  - [ ] 12.2.10 Style with Tailwind CSS

- [ ] 12.3 Create delete confirmation modal
  - [ ] 12.3.1 Show warning message
  - [ ] 12.3.2 Show category details
  - [ ] 12.3.3 Prevent deletion if productCount > 0
  - [ ] 12.3.4 Add confirm and cancel buttons
  - [ ] 12.3.5 Integrate with API
  - [ ] 12.3.6 Style with Tailwind CSS


## 13. Admin Panel - Products Page

- [ ] 13.1 Create Products page
  - [ ] 13.1.1 Fetch products from API with pagination
  - [ ] 13.1.2 Display product table (image, name, category, price, stock, status)
  - [ ] 13.1.3 Add search input (by name)
  - [ ] 13.1.4 Add category filter dropdown
  - [ ] 13.1.5 Add status filter dropdown (active/inactive, in-stock/out-of-stock)
  - [ ] 13.1.6 Add create product button
  - [ ] 13.1.7 Add edit button per product
  - [ ] 13.1.8 Add delete button per product
  - [ ] 13.1.9 Add pagination controls
  - [ ] 13.1.10 Add loading and error states
  - [ ] 13.1.11 Style with Tailwind CSS

- [ ] 13.2 Create Product modal
  - [ ] 13.2.1 Create modal component with form
  - [ ] 13.2.2 Add name input field
  - [ ] 13.2.3 Add description textarea
  - [ ] 13.2.4 Add price input field
  - [ ] 13.2.5 Add category dropdown (fetch from API)
  - [ ] 13.2.6 Add image upload with preview
  - [ ] 13.2.7 Add stock quantity input (optional)
  - [ ] 13.2.8 Add active checkbox
  - [ ] 13.2.9 Add in-stock checkbox
  - [ ] 13.2.10 Add form validation
  - [ ] 13.2.11 Integrate with API (create/update)
  - [ ] 13.2.12 Show success/error messages
  - [ ] 13.2.13 Style with Tailwind CSS

## 14. Admin Panel - Orders Page

- [ ] 14.1 Create Orders page
  - [ ] 14.1.1 Fetch orders from API with pagination
  - [ ] 14.1.2 Display order list (order number, customer, total, status, date)
  - [ ] 14.1.3 Add status filter dropdown
  - [ ] 14.1.4 Add date range picker
  - [ ] 14.1.5 Add search input (by order number, customer name/phone)
  - [ ] 14.1.6 Add view details button per order
  - [ ] 14.1.7 Add status update dropdown per order
  - [ ] 14.1.8 Add pagination controls
  - [ ] 14.1.9 Add loading and error states
  - [ ] 14.1.10 Style with Tailwind CSS

- [ ] 14.2 Create Order Details modal
  - [ ] 14.2.1 Create modal component
  - [ ] 14.2.2 Display order number
  - [ ] 14.2.3 Display customer information
  - [ ] 14.2.4 Display order items table
  - [ ] 14.2.5 Display total amount
  - [ ] 14.2.6 Display payment method
  - [ ] 14.2.7 Display current status
  - [ ] 14.2.8 Display status history timeline
  - [ ] 14.2.9 Add status update dropdown
  - [ ] 14.2.10 Add note textarea for status update
  - [ ] 14.2.11 Add update status button
  - [ ] 14.2.12 Add print order button
  - [ ] 14.2.13 Integrate with API
  - [ ] 14.2.14 Show success/error messages
  - [ ] 14.2.15 Style with Tailwind CSS

## 15. Admin Panel - Analytics Page

- [ ] 15.1 Create Analytics page
  - [ ] 15.1.1 Add date range selector
  - [ ] 15.1.2 Fetch analytics data from API
  - [ ] 15.1.3 Display metric comparison cards
  - [ ] 15.1.4 Create multiple chart types (line, bar, pie)
  - [ ] 15.1.5 Add export to CSV button
  - [ ] 15.1.6 Add export to PDF button
  - [ ] 15.1.7 Implement CSV export functionality
  - [ ] 15.1.8 Implement PDF export functionality
  - [ ] 15.1.9 Add loading and error states
  - [ ] 15.1.10 Style with Tailwind CSS

## 16. Customer App - Frontend Updates

- [x] 16.1 Update HomePage banner section
  - [x] 16.1.1 Remove static promo banner
  - [x] 16.1.2 Create banner carousel component
  - [x] 16.1.3 Fetch active banners from API
  - [x] 16.1.4 Display banner image, title, description
  - [x] 16.1.5 Add CTA button with configured text
  - [x] 16.1.6 Implement navigation on CTA click
  - [x] 16.1.7 Add auto-rotate (5 seconds)
  - [x] 16.1.8 Add navigation dots
  - [x] 16.1.9 Add loading skeleton
  - [x] 16.1.10 Style with Tailwind CSS

- [x] 16.2 Update HomePage category section
  - [x] 16.2.1 Add borders to circular category cards
  - [x] 16.2.2 Fetch categories from API
  - [x] 16.2.3 Filter to show only active categories
  - [x] 16.2.4 Order by category.order field
  - [x] 16.2.5 Update CategoryCard component
  - [x] 16.2.6 Add loading skeleton
  - [x] 16.2.7 Style with Tailwind CSS

- [x] 16.3 Update HomePage products section
  - [x] 16.3.1 Fetch products from API
  - [x] 16.3.2 Filter to show only active products
  - [x] 16.3.3 Update FeaturedProducts component
  - [x] 16.3.4 Add loading skeleton
  - [x] 16.3.5 Handle API errors gracefully

- [x] 16.4 Update MenuPage
  - [x] 16.4.1 Fetch products from API with category filter
  - [x] 16.4.2 Update product display
  - [x] 16.4.3 Add loading states


## 17. Testing

- [ ] 17.1 Backend unit tests
  - [ ] 17.1.1 Test AuthService methods
  - [ ] 17.1.2 Test BannerService methods
  - [ ] 17.1.3 Test CategoryService methods
  - [ ] 17.1.4 Test ProductService methods
  - [ ] 17.1.5 Test OrderService methods
  - [ ] 17.1.6 Test AnalyticsService methods
  - [ ] 17.1.7 Test UploadService methods
  - [ ] 17.1.8 Mock Firestore operations
  - [ ] 17.1.9 Achieve 80%+ code coverage

- [ ] 17.2 Backend integration tests
  - [ ] 17.2.1 Test authentication endpoints
  - [ ] 17.2.2 Test banner endpoints
  - [ ] 17.2.3 Test category endpoints
  - [ ] 17.2.4 Test product endpoints
  - [ ] 17.2.5 Test order endpoints
  - [ ] 17.2.6 Test analytics endpoints
  - [ ] 17.2.7 Test upload endpoint
  - [ ] 17.2.8 Use Firebase Emulator Suite

- [ ] 17.3 Property-based tests
  - [ ] 17.3.1 Test order total calculation property
  - [ ] 17.3.2 Test order number format property
  - [ ] 17.3.3 Test status transition validity property
  - [ ] 17.3.4 Test price calculation property
  - [ ] 17.3.5 Test JWT token expiration property

- [ ] 17.4 Frontend unit tests
  - [ ] 17.4.1 Test authentication store
  - [ ] 17.4.2 Test Login page component
  - [ ] 17.4.3 Test Dashboard page component
  - [ ] 17.4.4 Test modal components
  - [ ] 17.4.5 Mock API calls with MSW

## 18. Data Migration

- [ ] 18.1 Create migration script
  - [ ] 18.1.1 Export existing orders from MongoDB
  - [ ] 18.1.2 Transform data to Firestore format
  - [ ] 18.1.3 Validate transformed data
  - [ ] 18.1.4 Import to Firestore collections
  - [ ] 18.1.5 Verify data integrity
  - [ ] 18.1.6 Log migration results

- [ ] 18.2 Update existing code
  - [ ] 18.2.1 Update order routes to use Firestore
  - [ ] 18.2.2 Update product routes to use Firestore
  - [ ] 18.2.3 Remove mongoose dependencies
  - [ ] 18.2.4 Test backward compatibility

## 19. Security & Performance

- [ ] 19.1 Implement security measures
  - [ ] 19.1.1 Add rate limiting middleware
  - [ ] 19.1.2 Configure CORS with whitelisted origins
  - [ ] 19.1.3 Add input validation to all endpoints
  - [ ] 19.1.4 Sanitize user inputs
  - [ ] 19.1.5 Add HTTPS enforcement
  - [ ] 19.1.6 Add security headers (helmet)
  - [ ] 19.1.7 Implement request logging

- [ ] 19.2 Implement performance optimizations
  - [ ] 19.2.1 Add response compression (gzip)
  - [ ] 19.2.2 Implement analytics data caching (5 min TTL)
  - [ ] 19.2.3 Optimize Firestore queries with indexes
  - [ ] 19.2.4 Implement cursor-based pagination
  - [ ] 19.2.5 Enable Firebase CDN for images
  - [ ] 19.2.6 Add client-side image compression
  - [ ] 19.2.7 Implement code splitting in admin panel
  - [ ] 19.2.8 Optimize bundle size

## 20. Deployment

- [ ] 20.1 Backend deployment
  - [ ] 20.1.1 Configure Render deployment
  - [ ] 20.1.2 Set environment variables in Render
  - [ ] 20.1.3 Configure build command
  - [ ] 20.1.4 Configure start command
  - [ ] 20.1.5 Deploy to Render
  - [ ] 20.1.6 Test API endpoints
  - [ ] 20.1.7 Monitor logs

- [ ] 20.2 Admin panel deployment
  - [ ] 20.2.1 Configure Vercel deployment
  - [ ] 20.2.2 Set environment variables in Vercel
  - [ ] 20.2.3 Configure build settings
  - [ ] 20.2.4 Deploy to Vercel
  - [ ] 20.2.5 Configure custom domain (admin.example.com)
  - [ ] 20.2.6 Test admin panel functionality
  - [ ] 20.2.7 Verify authentication flow

- [ ] 20.3 Customer app deployment
  - [ ] 20.3.1 Update environment variables with new API URL
  - [ ] 20.3.2 Deploy updated customer app to Vercel
  - [ ] 20.3.3 Test banner carousel
  - [ ] 20.3.4 Test category and product loading
  - [ ] 20.3.5 Verify order creation flow

- [ ] 20.4 Firebase configuration
  - [ ] 20.4.1 Verify Firestore indexes are created
  - [ ] 20.4.2 Verify security rules are deployed
  - [ ] 20.4.3 Configure Firebase monitoring
  - [ ] 20.4.4 Set up backup schedule

## 21. Documentation

- [ ] 21.1 Create API documentation
  - [ ] 21.1.1 Document all endpoints with examples
  - [ ] 21.1.2 Document request/response formats
  - [ ] 21.1.3 Document authentication flow
  - [ ] 21.1.4 Document error codes

- [ ] 21.2 Create deployment documentation
  - [ ] 21.2.1 Document backend deployment steps
  - [ ] 21.2.2 Document admin panel deployment steps
  - [ ] 21.2.3 Document environment variables
  - [ ] 21.2.4 Document Firebase setup

- [ ] 21.3 Create user documentation
  - [ ] 21.3.1 Create admin panel user guide
  - [ ] 21.3.2 Document banner management
  - [ ] 21.3.3 Document category management
  - [ ] 21.3.4 Document product management
  - [ ] 21.3.5 Document order management
  - [ ] 21.3.6 Document analytics usage

- [ ] 21.4 Create developer documentation
  - [ ] 21.4.1 Document code structure
  - [ ] 21.4.2 Document database schema
  - [ ] 21.4.3 Document service interfaces
  - [ ] 21.4.4 Add JSDoc comments to code

## 22. Monitoring & Maintenance

- [ ] 22.1 Set up monitoring
  - [ ] 22.1.1 Configure Firebase monitoring
  - [ ] 22.1.2 Set up error tracking (Sentry or similar)
  - [ ] 22.1.3 Configure performance monitoring
  - [ ] 22.1.4 Set up alerts for critical errors
  - [ ] 22.1.5 Monitor API response times

- [ ] 22.2 Maintenance tasks
  - [ ] 22.2.1 Schedule regular dependency updates
  - [ ] 22.2.2 Schedule security audits
  - [ ] 22.2.3 Configure Firestore backup schedule
  - [ ] 22.2.4 Monitor storage usage
  - [ ] 22.2.5 Review and optimize slow queries
