# Borama Library Management System

A beginner-friendly full-stack web application for library management built with React, Node.js, Express, and MongoDB.

## Project Structure

```
Borama Library/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   ├── Login.css
│   │   │   └── Register.css
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
└── backend/
    ├── config/
    │   └── db.js
    ├── controllers/
    │   └── authController.js
    ├── models/
    │   └── User.js
    ├── routes/
    │   └── auth.js
    ├── middleware/
    │   └── auth.js
    ├── server.js
    ├── .env
    └── package.json
```

## Features

### Authentication
- User registration with email validation
- User login with JWT tokens
- Password hashing with bcryptjs
- Protected routes with middleware
- Token stored in localStorage

### API Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires authentication)

## Setup Instructions

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Make sure MongoDB is running on your local machine:
   ```bash
   mongod
   ```

4. Update `.env` file with your configuration (if needed)

5. Start the server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`

## How It Works

### Registration Flow
1. User fills in name, email, password, and confirm password
2. Frontend validates the form
3. Frontend sends data to `/api/auth/register`
4. Backend validates, hashes password, and saves user to MongoDB
5. Backend returns JWT token
6. Frontend stores token in localStorage
7. User is redirected to dashboard

### Login Flow
1. User enters email and password
2. Frontend validates the form
3. Frontend sends data to `/api/auth/login`
4. Backend finds user, compares password with hash
5. Backend returns JWT token if credentials are correct
6. Frontend stores token in localStorage
7. User is redirected to dashboard

## Technology Stack

**Frontend:**
- React 18
- React Router DOM
- Axios
- CSS3 with Flexbox
- Vite

**Backend:**
- Node.js
- Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Notes

- This is a beginner-level project meant for learning
- Passwords are hashed using bcryptjs with 10 salt rounds
- JWT tokens expire after 7 days
- The project uses simple CSS without frameworks like Tailwind
- All code includes helpful comments for learning

## Next Steps

- Add more authentication features (password reset, email verification)
- Create a dashboard page
- Add book management features
- Add user profiles
- Implement more advanced error handling
- Add unit tests

---

© 2024 Borama Library Management System
