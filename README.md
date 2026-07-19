[text](../../ShopEZ_Documentation.docx)# ShopEZ — MERN Stack E-commerce Platform

A full-stack e-commerce application built with MongoDB, Express, React (Vite), and Node.js.

## Features
- User registration/login with JWT authentication & bcrypt password hashing
- Role-based access control (USER / ADMIN)
- Product browsing, search, and category filtering
- Product detail pages
- Cart system (add/remove/update quantity, calculates totals) — persisted in localStorage
- Checkout flow that creates a real order and decrements stock
- User profile page with order history
- Admin dashboard with stats
- Admin product management (add/edit/delete, image upload via Multer)
- Admin order management (view all orders, update status)

## Project Structure
```
ShopEZ/
├── client/     React (Vite) frontend
└── server/     Express + MongoDB backend
```

## Prerequisites
- Node.js v18+
- MongoDB running locally (or a MongoDB Atlas connection string)

## Setup & Run

### 1. Backend
```bash
cd server
npm install
npm start          # or: npm run dev  (requires nodemon, already in devDependencies)
```
The server runs on **http://localhost:8000** and expects MongoDB at the URI in `server/.env`:
```
PORT=8000
MONGO_URI=mongodb://127.0.0.1:27017/shopez
JWT_SECRET=shopez123
```
> Change `JWT_SECRET` to a strong random string before deploying to production.

### 2. Frontend
Open a second terminal:
```bash
cd client
npm install
npm run dev
```
The app runs on **http://localhost:5173** and proxies `/api` and `/uploads` requests to the backend (see `client/vite.config.js`), so no CORS configuration is needed in development.

## Creating an Admin User
The registration form always creates a `USER`. To create an admin account, register normally, then either:
- Manually update the user's `role` field to `"ADMIN"` in MongoDB (e.g. via `mongosh` or Compass), or
- Send a `POST /api/auth/register` request with `"role": "ADMIN"` in the JSON body (e.g. via Postman) — the backend controller accepts this field.

Once your account has `role: "ADMIN"`, log in and you'll see an "Admin Dashboard" link in the navbar.

## API Overview

| Method | Endpoint                  | Access        | Description                  |
|--------|----------------------------|---------------|-------------------------------|
| POST   | /api/auth/register          | Public        | Register a new user           |
| POST   | /api/auth/login              | Public        | Login and receive a JWT       |
| GET    | /api/auth/profile            | Private       | Get logged-in user's profile  |
| PUT    | /api/auth/profile            | Private       | Update profile / password     |
| GET    | /api/products                | Public        | List products (search/category query params) |
| GET    | /api/products/:id            | Public        | Get single product            |
| POST   | /api/products/add            | Admin         | Add product (multipart, field: image) |
| PUT    | /api/products/:id            | Admin         | Update product                |
| DELETE | /api/products/:id            | Admin         | Delete product                |
| POST   | /api/orders                  | Private       | Place an order                |
| GET    | /api/orders                  | Private       | List own orders (all orders for admin) |
| GET    | /api/orders/:id              | Private       | Get single order              |
| PUT    | /api/orders/:id              | Admin         | Update order status           |

## Notes
- Uploaded product images are stored in `server/uploads/` and served statically at `/uploads/<filename>`.
- The cart is client-side (localStorage) until checkout, at which point an `Order` document is created and product stock is decremented server-side.
- All private/admin routes are protected by JWT middleware (`authMiddleware.js`) and role middleware (`adminMiddleware.js`).
- #DEMO VIDEO
- GOOGLE DRIVE LINK:https://drive.google.com/file/d/1XRbAqsbSubWiTU5cKHeQ-YYuH3_rLRk7/view?usp=drive_link
