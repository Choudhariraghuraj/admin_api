# Admin API (Node.js + Express + MongoDB)

A secure backend API for user authentication and admin dashboard functionality, built with TypeScript, Express, and MongoDB.

## 🚀 Features

- ✅ JWT Authentication (Login/Register)
- 🧑‍💻 User CRUD for Admins
- 🔐 Protected routes using middleware
- 📸 Avatar upload with Multer
- 🛡️ Password hashing and validation
- 🌍 CORS-ready for frontend integration
- 📁 File upload route for serving avatar images

## 🧑‍💻 Tech Stack

- Node.js + TypeScript
- Express
- MongoDB + Mongoose
- Multer (image upload)
- Bcrypt + JWT
- dotenv, cors

## 🌐 Live API

Backend: [https://admin-api-hlyn.onrender.com](https://admin-api-hlyn.onrender.com)

## 📦 API Endpoints

### Auth
    POST /api/auth/register POST /api/auth/login

### User Profile
    GET /api/users/me PUT /api/users/me

### User CRUD (Admin only)
    GET /api/users/ POST /api/users/ PUT /api/users/:id DELETE /api/users/:id

## 🔧 Setup

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build