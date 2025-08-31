# Spices Website Monorepo

This repository contains two main frontend projects and a backend API:

- **User-facing E-commerce Website** ([Live Demo](https://spices-website-frontend.vercel.app/))
- **Admin Dashboard** ([Live Demo](https://spices-website-admin-dashboard.vercel.app/))
- **Backend API** (Node.js/Express server)

---

## Projects Overview

### 1. Frontend (User Website)

- Path: `frontend/`
- Tech: React, Vite, Tailwind CSS
- Features:
  - Modern e-commerce UI
  - Product listings, categories, testimonials, and more
  - Responsive and visually rich design
- [View Live](https://spices-website-frontend.vercel.app/)

### 2. Ecom Dashboard (Admin Panel)

- Path: `ecom-dashboard/`
- Tech: React, Vite, Tailwind CSS
- Features:
  - Admin authentication
  - Product CRUD (Create, Read, Update, Delete)
  - Category management
  - Dashboard analytics
  - Order and customer management (extendable)
- [View Live](https://spices-website-admin-dashboard.vercel.app/)

#### Admin Login Credentials

**Local Development:**
- **Email:** `vibecoders@gmail.com`
- **Password:** `vibecoder`

### 3. Backend API

- Path: `backend/`
- Tech: Node.js, Express, MongoDB
- Features:
  - User authentication and authorization
  - Product, category, and brand management APIs
  - Order processing
  - Admin user management

---

## Getting Started (Development)

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)

### Running the Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
# Create a .env file with your MongoDB connection string and JWT secret
# Example:
# MONGODB_URI=mongodb://localhost:27017/spices-website
# JWT_SECRET=your-jwt-secret-key
# PORT=5000

# Start the backend server
npm start
# or for development with auto-restart
npm run dev
```

The backend will run on `http://localhost:5000` by default.

### Running the Frontend Projects

```bash
# For user website
cd frontend
npm install
npm run dev

# For admin dashboard (in a new terminal)
cd ../ecom-dashboard
npm install
npm run dev
```

Make sure the backend is running before starting the frontend applications for full functionality.

---

## Folder Structure

```
spices-website/
├── backend/           # Node.js/Express API server
├── frontend/          # User-facing e-commerce site
├── ecom-dashboard/    # Admin dashboard
└── README.md
```

---

## API Endpoints

The backend provides RESTful APIs for:
- `/users` - User authentication and management
- `/products` - Product CRUD operations
- `/categories` - Category management
- `/brands` - Brand management
- `/orders` - Order processing

---

## License

This project is for demonstration and freelance use. Please contact the owner for