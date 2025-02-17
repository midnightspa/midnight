# API Endpoints Structure

## Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/reset-password
- GET /api/auth/me

## Categories
- GET /api/categories
- POST /api/categories
- GET /api/categories/:id
- PUT /api/categories/:id
- DELETE /api/categories/:id
- GET /api/categories/:id/subcategories

## Posts
- GET /api/posts
- POST /api/posts
- GET /api/posts/:id
- PUT /api/posts/:id
- DELETE /api/posts/:id
- GET /api/posts/category/:categoryId

## Videos
- GET /api/videos
- POST /api/videos
- GET /api/videos/:id
- PUT /api/videos/:id
- DELETE /api/videos/:id

## Shop
- GET /api/products
- POST /api/products
- GET /api/products/:id
- PUT /api/products/:id
- DELETE /api/products/:id
- GET /api/bundles
- POST /api/bundles
- GET /api/orders
- POST /api/orders
- GET /api/orders/:id 