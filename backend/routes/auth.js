// Authentication routes - defines endpoints for register and login
const express = require('express');
const {
  register,
  login,
  getCurrentUser,
} = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', register); // POST /api/auth/register
router.post('/login', login); // POST /api/auth/login

// Protected routes (require authentication)
router.get('/me', authMiddleware, getCurrentUser); // GET /api/auth/me

module.exports = router;
