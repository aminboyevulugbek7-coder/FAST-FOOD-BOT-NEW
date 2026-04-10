# Requirements Document: Admin Panel & Backend Integration

## 1. Functional Requirements

### 1.1 Authentication & Authorization

**1.1.1** The system SHALL provide JWT-based authentication for admin users
- Admin users must authenticate with email and password
- System generates JWT token valid for 24 hours
- Token contains admin ID, email, and role

**1.1.2** The system SHALL support role-based access control
- Two roles: 'admin' and 'super_admin'
- Super_admin can manage other admin users
- Regular admin can manage content (banners, categories, products, orders)

**1.1.3** The system SHALL protect all admin API endpoints with authentication middleware
- Requests must include valid JWT token in Authorization header
- Invalid or expired tokens result in 401 Unauthorized response

**1.1.4** The system SHALL hash admin passwords using bcrypt with cost factor 12

### 1.2 Advertisement Banner Management

**1.2.1** The system SHALL allow admins to create advertisement banners with:
- Title (3-100 characters)
- Description (10-500 characters)
- Image URL (uploaded to Firebase Storage)
- CTA button text (2-50 characters)
- Optional CTA link
- Display order (positive integer)

**1.2.2** The system SHALL allow admins to update existing banners

**1.2.3** The system SHALL allow admins to delete banners

**1.2.4** The system SHALL allow admins to toggle banner active/inactive status

**1.2.5** The system SHALL display active banners on customer app homepage ordered by 'order' field

**1.2.6** The system SHALL support banner reordering via drag-and-drop in admin panel

### 1.3 Category Management

**1.3.1** The system SHALL allow admins to create product categories with:
- Name (2-50 characters, unique)
- Description (10-500 characters)
- Image URL (uploaded to Firebase Storage)
- Display order (positive integer)

**1.3.2** The system SHALL allow admins to update existing categories

**1.3.3** The system SHALL allow admins to delete categories only if productCount is 0

**1.3.4** The system SHALL automatically track product count per category

**1.3.5** The system SHALL allow admins to toggle category active/inactive status

**1.3.6** The system SHALL allow admins to reorder categories

**1.3.7** The system SHALL display active categories on customer app homepage


### 1.4 Product Management

**1.4.1** The system SHALL allow admins to create products with:
- Name (2-100 characters)
- Description (10-1000 characters)
- Price (positive number with max 2 decimal places)
- Image URL (uploaded to Firebase Storage)
- Category ID (must reference existing category)
- Optional stock quantity (non-negative integer)

**1.4.2** The system SHALL allow admins to update existing products

**1.4.3** The system SHALL allow admins to delete products

**1.4.4** The system SHALL allow admins to toggle product active/inactive status

**1.4.5** The system SHALL allow admins to toggle product in-stock status

**1.4.6** The system SHALL allow admins to update product stock quantity

**1.4.7** The system SHALL validate that categoryId references an existing category

**1.4.8** The system SHALL automatically populate categoryName from referenced category

**1.4.9** The system SHALL support product filtering by:
- Category
- Active/inactive status
- In-stock status
- Search by name

**1.4.10** The system SHALL support product pagination with configurable page size (default 20, max 100)

### 1.5 Order Management

**1.5.1** The system SHALL allow customers to create orders with:
- Array of items (productId, quantity)
- Customer information (name, phone, address)
- Payment method (cash, card, online)
- Optional comment

**1.5.2** The system SHALL generate unique order numbers in format "ORD-YYYYMMDD-XXXX"

**1.5.3** The system SHALL automatically calculate order totals:
- Item subtotal = price × quantity
- Order totalAmount = sum of all item subtotals

**1.5.4** The system SHALL validate all products in order exist and are active

**1.5.5** The system SHALL initialize orders with 'pending' status

**1.5.6** The system SHALL allow admins to update order status with valid transitions:
- pending → confirmed, cancelled
- confirmed → preparing, cancelled
- preparing → delivering, cancelled
- delivering → completed, cancelled
- completed → (no transitions)
- cancelled → (no transitions)

**1.5.7** The system SHALL maintain order status history with:
- Status value
- Timestamp
- Optional note
- Optional updatedBy (admin ID)

**1.5.8** The system SHALL allow admins to view all orders with filters:
- Status
- Date range (start date, end date)
- Search by order number or customer name/phone

**1.5.9** The system SHALL support order pagination

**1.5.10** The system SHALL allow admins to view detailed order information including:
- Order items with product names, quantities, prices
- Customer information
- Payment method
- Current status
- Status history timeline

**1.5.11** The system SHALL allow admins to cancel orders with cancellation reason


### 1.6 Analytics & Reporting

**1.6.1** The system SHALL provide dashboard metrics including:
- Total orders count
- Total revenue (from completed orders)
- Average order value
- Completed orders count
- Pending orders count
- Cancelled orders count
- Top 10 products by revenue
- Revenue growth percentage (vs previous period)
- Order growth percentage (vs previous period)

**1.6.2** The system SHALL support date range filtering for analytics (max 1 year range)

**1.6.3** The system SHALL provide orders over time data with grouping by:
- Day
- Week
- Month

**1.6.4** The system SHALL provide revenue over time data with grouping by:
- Day
- Week
- Month

**1.6.5** The system SHALL calculate top products statistics including:
- Product name
- Total orders containing product
- Total quantity sold
- Total revenue generated

**1.6.6** The system SHALL support exporting analytics reports in:
- CSV format
- PDF format

**1.6.7** The system SHALL cache analytics data for 5 minutes to improve performance

### 1.7 File Upload Management

**1.7.1** The system SHALL allow admins to upload images to Firebase Storage

**1.7.2** The system SHALL validate uploaded images:
- Allowed types: JPG, PNG, WebP
- Maximum size: 5MB
- Valid image content

**1.7.3** The system SHALL generate unique filenames using timestamp and random string

**1.7.4** The system SHALL organize uploads in folders:
- banners/
- categories/
- products/

**1.7.5** The system SHALL make uploaded images publicly accessible

**1.7.6** The system SHALL return public URL after successful upload

**1.7.7** The system SHALL support deleting images from Firebase Storage

### 1.8 Customer App Frontend Updates

**1.8.1** The system SHALL replace static promo banner with dynamic banner carousel

**1.8.2** The system SHALL fetch active banners from API and display on homepage

**1.8.3** The system SHALL add visible borders to category cards (circular categories)

**1.8.4** The system SHALL fetch categories from API instead of hardcoded data

**1.8.5** The system SHALL fetch products from API instead of hardcoded data

**1.8.6** The system SHALL display banner CTA button with configured text and link


## 2. Non-Functional Requirements

### 2.1 Performance

**2.1.1** API response time SHALL be less than 200ms for 95th percentile

**2.1.2** Dashboard load time SHALL be less than 2 seconds

**2.1.3** Image upload SHALL complete within 5 seconds for 5MB file

**2.1.4** Order creation SHALL complete within 500ms

**2.1.5** Analytics queries SHALL complete within 1 second for 30-day range

**2.1.6** The system SHALL implement pagination for large datasets (default 20 items per page)

**2.1.7** The system SHALL cache analytics data for 5 minutes

**2.1.8** The system SHALL cache category and product lists for 1 minute

### 2.2 Security

**2.2.1** The system SHALL use HTTPS for all API communications

**2.2.2** The system SHALL implement rate limiting:
- Login: 5 attempts per 15 minutes per IP
- API calls: 100 requests per minute per IP
- Upload: 10 uploads per hour per user

**2.2.3** The system SHALL validate and sanitize all user inputs

**2.2.4** The system SHALL use JWT secret key of at least 256 bits

**2.2.5** The system SHALL not expose stack traces in production error responses

**2.2.6** The system SHALL not log passwords or authentication tokens

**2.2.7** The system SHALL implement CORS with whitelisted origins only

**2.2.8** The system SHALL implement Firestore security rules to restrict data access

**2.2.9** The system SHALL implement Firebase Storage security rules to restrict uploads

**2.2.10** The system SHALL store all secrets in environment variables

### 2.3 Reliability

**2.3.1** The system SHALL handle Firestore connection failures gracefully

**2.3.2** The system SHALL retry failed operations with exponential backoff

**2.3.3** The system SHALL log all errors for debugging and monitoring

**2.3.4** The system SHALL validate data integrity before saving to database

**2.3.5** The system SHALL prevent duplicate order numbers through unique constraints

### 2.4 Scalability

**2.4.1** The system SHALL support at least 1000 concurrent users

**2.4.2** The system SHALL use Firestore indexes for efficient queries

**2.4.3** The system SHALL implement cursor-based pagination for large result sets

**2.4.4** The system SHALL use Firebase CDN for image delivery

### 2.5 Usability

**2.5.1** Admin panel SHALL be responsive and work on desktop browsers (1280px+)

**2.5.2** Admin panel SHALL provide clear error messages for validation failures

**2.5.3** Admin panel SHALL show loading states during async operations

**2.5.4** Admin panel SHALL provide confirmation dialogs for destructive actions

**2.5.5** Admin panel SHALL support keyboard navigation

**2.5.6** Customer app SHALL display banners with smooth transitions

**2.5.7** Customer app SHALL show loading skeletons while fetching data

### 2.6 Maintainability

**2.6.1** Code SHALL follow TypeScript best practices and type safety

**2.6.2** Code SHALL be organized in modular services and components

**2.6.3** Code SHALL include JSDoc comments for public APIs

**2.6.4** Code SHALL achieve at least 80% test coverage

**2.6.5** API endpoints SHALL follow RESTful conventions

**2.6.6** Database schema SHALL be documented in design document


## 3. Technical Requirements

### 3.1 Backend Technology Stack

**3.1.1** Backend SHALL be built with Node.js and Express.js

**3.1.2** Backend SHALL use TypeScript for type safety

**3.1.3** Backend SHALL use Firebase Firestore as primary database

**3.1.4** Backend SHALL use Firebase Storage for file uploads

**3.1.5** Backend SHALL use JWT for authentication

**3.1.6** Backend SHALL use bcryptjs for password hashing

**3.1.7** Backend SHALL use Winston for logging

**3.1.8** Backend SHALL use express-validator for input validation

**3.1.9** Backend SHALL use multer for file upload handling

### 3.2 Frontend Technology Stack (Admin Panel)

**3.2.1** Admin panel SHALL be built with React 18+

**3.2.2** Admin panel SHALL use TypeScript for type safety

**3.2.3** Admin panel SHALL use Vite as build tool

**3.2.4** Admin panel SHALL use Tailwind CSS for styling

**3.2.5** Admin panel SHALL use React Router for navigation

**3.2.6** Admin panel SHALL use Zustand for state management

**3.2.7** Admin panel SHALL use Axios for HTTP requests

**3.2.8** Admin panel SHALL use Recharts for data visualization

**3.2.9** Admin panel SHALL use date-fns for date formatting

### 3.3 Database Schema

**3.3.1** Firestore SHALL have 'admins' collection with fields:
- id, email, passwordHash, name, role, createdAt, updatedAt, lastLogin

**3.3.2** Firestore SHALL have 'banners' collection with fields:
- id, title, description, imageUrl, ctaText, ctaLink, isActive, order, createdAt, updatedAt

**3.3.3** Firestore SHALL have 'categories' collection with fields:
- id, name, description, imageUrl, order, isActive, productCount, createdAt, updatedAt

**3.3.4** Firestore SHALL have 'products' collection with fields:
- id, name, description, price, imageUrl, categoryId, categoryName, isActive, inStock, stockQuantity, createdAt, updatedAt

**3.3.5** Firestore SHALL have 'orders' collection with fields:
- id, orderNumber, items, totalAmount, customerInfo, paymentMethod, status, comment, statusHistory, createdAt, updatedAt

**3.3.6** Firestore SHALL have indexes:
- admins: email (unique)
- banners: (isActive, order) composite
- categories: name (unique), (isActive, order) composite
- products: categoryId, (isActive, categoryId) composite, name
- orders: orderNumber (unique), (status, createdAt) composite, createdAt descending

### 3.4 API Endpoints

**3.4.1** Backend SHALL implement authentication endpoints:
- POST /api/auth/login
- GET /api/auth/me

**3.4.2** Backend SHALL implement banner endpoints:
- GET /api/banners
- POST /api/banners
- PUT /api/banners/:id
- DELETE /api/banners/:id

**3.4.3** Backend SHALL implement category endpoints:
- GET /api/categories
- POST /api/categories
- PUT /api/categories/:id
- DELETE /api/categories/:id

**3.4.4** Backend SHALL implement product endpoints:
- GET /api/products
- GET /api/products/:id
- POST /api/products
- PUT /api/products/:id
- DELETE /api/products/:id

**3.4.5** Backend SHALL implement order endpoints:
- GET /api/orders
- GET /api/orders/:id
- POST /api/orders
- PATCH /api/orders/:id/status

**3.4.6** Backend SHALL implement analytics endpoints:
- GET /api/analytics/dashboard
- GET /api/analytics/orders-over-time
- GET /api/analytics/revenue-over-time
- GET /api/analytics/export

**3.4.7** Backend SHALL implement upload endpoint:
- POST /api/upload

### 3.5 Deployment

**3.5.1** Backend SHALL be deployed to Render

**3.5.2** Admin panel SHALL be deployed to Vercel

**3.5.3** Customer app SHALL be deployed to Vercel

**3.5.4** Firebase project SHALL be configured for production use

**3.5.5** Environment variables SHALL be configured in deployment platforms

**3.5.6** Custom domain SHALL be configured for admin panel (admin.example.com)


## 4. Data Integrity Requirements

### 4.1 Order Data Integrity

**4.1.1** Order totalAmount MUST equal sum of all item subtotals

**4.1.2** Order item subtotal MUST equal price × quantity

**4.1.3** Order numbers MUST be unique across all orders

**4.1.4** Order status transitions MUST follow valid state machine rules

**4.1.5** Order status history MUST be chronologically ordered

### 4.2 Product Data Integrity

**4.2.1** Product categoryId MUST reference existing category

**4.2.2** Product price MUST be positive number

**4.2.3** Product stockQuantity MUST be non-negative integer if provided

**4.2.4** Product categoryName MUST match referenced category name

### 4.3 Category Data Integrity

**4.3.1** Category name MUST be unique

**4.3.2** Category productCount MUST match actual number of products in category

**4.3.3** Category deletion MUST be prevented if productCount > 0

### 4.4 Banner Data Integrity

**4.4.1** Active banner order values MUST be unique

**4.4.2** Banner imageUrl MUST be valid and accessible

### 4.5 Authentication Data Integrity

**4.5.1** Admin email MUST be unique

**4.5.2** Admin passwordHash MUST be bcrypt hash

**4.5.3** JWT tokens MUST not be expired for valid authentication

## 5. User Interface Requirements

### 5.1 Admin Panel Pages

**5.1.1** Login Page SHALL include:
- Email input field
- Password input field
- Login button
- Error message display
- Remember me checkbox (optional)

**5.1.2** Dashboard Page SHALL include:
- Metric cards (total orders, revenue, avg order value)
- Date range picker
- Orders over time line chart
- Revenue over time bar chart
- Top products table
- Refresh button

**5.1.3** Banners Page SHALL include:
- Banner list with image previews
- Create banner button
- Edit banner button per item
- Delete banner button per item
- Active/inactive toggle per item
- Drag-and-drop reordering

**5.1.4** Categories Page SHALL include:
- Category grid with images
- Create category button
- Edit category button per item
- Delete category button per item
- Product count display per item
- Active/inactive toggle per item
- Reorder functionality

**5.1.5** Products Page SHALL include:
- Product table with columns (image, name, category, price, stock, status)
- Search input
- Category filter dropdown
- Status filter dropdown
- Create product button
- Edit product button per row
- Delete product button per row
- Pagination controls

**5.1.6** Orders Page SHALL include:
- Order list with columns (order number, customer, total, status, date)
- Status filter dropdown
- Date range picker
- Search input
- View details button per row
- Status update dropdown per row
- Pagination controls

**5.1.7** Analytics Page SHALL include:
- Date range selector
- Multiple chart types (line, bar, pie)
- Metric comparison cards
- Export to CSV button
- Export to PDF button
- Print button

**5.1.8** Layout Component SHALL include:
- Sidebar navigation with links to all pages
- Header with admin name and logout button
- Active route highlighting
- Responsive design

### 5.2 Admin Panel Modals

**5.2.1** Create/Edit Banner Modal SHALL include:
- Title input
- Description textarea
- Image upload with preview
- CTA text input
- CTA link input (optional)
- Order number input
- Active checkbox
- Save button
- Cancel button

**5.2.2** Create/Edit Category Modal SHALL include:
- Name input
- Description textarea
- Image upload with preview
- Order number input
- Active checkbox
- Save button
- Cancel button

**5.2.3** Create/Edit Product Modal SHALL include:
- Name input
- Description textarea
- Price input
- Category dropdown
- Image upload with preview
- Stock quantity input (optional)
- Active checkbox
- In stock checkbox
- Save button
- Cancel button

**5.2.4** Order Details Modal SHALL include:
- Order number display
- Customer information display
- Order items table
- Total amount display
- Payment method display
- Current status display
- Status history timeline
- Status update dropdown
- Note textarea for status update
- Update status button
- Print order button
- Close button

**5.2.5** Delete Confirmation Modal SHALL include:
- Warning message
- Item details
- Confirm button
- Cancel button

### 5.3 Customer App Updates

**5.3.1** HomePage Banner Section SHALL:
- Display carousel of active banners
- Show banner image, title, description
- Show CTA button with configured text
- Navigate to CTA link on button click
- Auto-rotate banners every 5 seconds
- Show navigation dots

**5.3.2** HomePage Category Section SHALL:
- Display circular category cards with borders
- Show category image and name
- Fetch categories from API
- Filter to show only active categories
- Order by category.order field

**5.3.3** HomePage Products Section SHALL:
- Fetch products from API
- Display product cards with image, name, price
- Filter to show only active products


## 6. Testing Requirements

### 6.1 Unit Testing

**6.1.1** Backend services SHALL have unit tests with 80%+ code coverage

**6.1.2** Unit tests SHALL mock Firestore operations

**6.1.3** Unit tests SHALL cover validation logic

**6.1.4** Unit tests SHALL cover error handling paths

**6.1.5** Frontend components SHALL have unit tests using React Testing Library

**6.1.6** Frontend tests SHALL mock API calls

### 6.2 Integration Testing

**6.2.1** API endpoints SHALL have integration tests using Supertest

**6.2.2** Integration tests SHALL use Firebase Emulator Suite

**6.2.3** Integration tests SHALL verify complete request/response cycles

**6.2.4** Integration tests SHALL test authentication middleware

**6.2.5** Integration tests SHALL verify database operations

### 6.3 Property-Based Testing

**6.3.1** Order total calculation SHALL be tested with property-based tests

**6.3.2** Order number format SHALL be tested with property-based tests

**6.3.3** Status transition validity SHALL be tested with property-based tests

**6.3.4** Price calculation SHALL be tested with property-based tests

**6.3.5** JWT token expiration SHALL be tested with property-based tests

### 6.4 End-to-End Testing (Optional)

**6.4.1** Critical user journeys SHALL be tested end-to-end

**6.4.2** E2E tests SHALL cover login → create product → view in customer app

**6.4.3** E2E tests SHALL cover order creation → status updates → completion

## 7. Migration Requirements

### 7.1 Data Migration

**7.1.1** Existing MongoDB orders SHALL be migrated to Firestore

**7.1.2** Migration script SHALL transform data to Firestore format

**7.1.3** Migration SHALL verify data integrity after completion

**7.1.4** Migration SHALL maintain order number uniqueness

### 7.2 Code Migration

**7.2.1** Existing order routes SHALL be updated to use Firestore

**7.2.2** Existing product routes SHALL be updated to use Firestore

**7.2.3** Mongoose models SHALL be replaced with Firestore queries

**7.2.4** Both MongoDB and Firestore SHALL run in parallel during transition

### 7.3 Backward Compatibility

**7.3.1** Existing API endpoints SHALL remain functional during migration

**7.3.2** Customer app SHALL continue to work during backend updates

**7.3.3** Migration SHALL be performed with zero downtime

## 8. Documentation Requirements

**8.1** API endpoints SHALL be documented with request/response examples

**8.2** Database schema SHALL be documented with field descriptions

**8.3** Authentication flow SHALL be documented with sequence diagrams

**8.4** Deployment process SHALL be documented step-by-step

**8.5** Environment variables SHALL be documented with descriptions

**8.6** Error codes and messages SHALL be documented

**8.7** Admin panel user guide SHALL be created

**8.8** Code SHALL include JSDoc comments for public functions

## 9. Acceptance Criteria

### 9.1 Authentication

- [ ] Admin can login with valid credentials
- [ ] Admin receives JWT token on successful login
- [ ] Invalid credentials return appropriate error
- [ ] Expired tokens are rejected
- [ ] Protected routes require valid token

### 9.2 Banner Management

- [ ] Admin can create banner with all required fields
- [ ] Admin can upload banner image
- [ ] Admin can edit existing banner
- [ ] Admin can delete banner
- [ ] Admin can toggle banner active/inactive
- [ ] Admin can reorder banners
- [ ] Active banners display on customer app homepage

### 9.3 Category Management

- [ ] Admin can create category with all required fields
- [ ] Admin can upload category image
- [ ] Admin can edit existing category
- [ ] Admin can delete category (only if no products)
- [ ] Admin can toggle category active/inactive
- [ ] Admin can reorder categories
- [ ] Product count updates automatically
- [ ] Active categories display on customer app

### 9.4 Product Management

- [ ] Admin can create product with all required fields
- [ ] Admin can upload product image
- [ ] Admin can edit existing product
- [ ] Admin can delete product
- [ ] Admin can toggle product active/inactive
- [ ] Admin can update stock quantity
- [ ] Admin can filter products by category, status
- [ ] Admin can search products by name
- [ ] Products display with pagination
- [ ] Active products display on customer app

### 9.5 Order Management

- [ ] Customer can create order from customer app
- [ ] Order receives unique order number
- [ ] Order total calculates correctly
- [ ] Admin can view all orders with filters
- [ ] Admin can view order details
- [ ] Admin can update order status
- [ ] Status transitions follow valid rules
- [ ] Status history tracks all changes
- [ ] Admin can cancel order with reason

### 9.6 Analytics

- [ ] Dashboard displays correct metrics
- [ ] Date range filter works correctly
- [ ] Orders over time chart displays data
- [ ] Revenue over time chart displays data
- [ ] Top products table shows correct data
- [ ] Growth percentages calculate correctly
- [ ] Export to CSV works
- [ ] Export to PDF works

### 9.7 File Upload

- [ ] Admin can upload images (JPG, PNG, WebP)
- [ ] Images larger than 5MB are rejected
- [ ] Invalid file types are rejected
- [ ] Uploaded images are publicly accessible
- [ ] Unique filenames are generated

### 9.8 Customer App Updates

- [ ] Dynamic banners display on homepage
- [ ] Category cards have visible borders
- [ ] Categories load from API
- [ ] Products load from API
- [ ] Banner CTA button works correctly

### 9.9 Performance

- [ ] API responses under 200ms (p95)
- [ ] Dashboard loads under 2 seconds
- [ ] Image upload completes under 5 seconds
- [ ] Analytics queries complete under 1 second

### 9.10 Security

- [ ] All API endpoints use HTTPS
- [ ] Rate limiting prevents abuse
- [ ] Input validation prevents injection
- [ ] Passwords are hashed with bcrypt
- [ ] JWT tokens expire after 24 hours
- [ ] CORS restricts to whitelisted origins
- [ ] Firestore security rules enforce access control
