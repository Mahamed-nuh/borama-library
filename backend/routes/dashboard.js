// Dashboard routes - protected routes that require authentication
const express = require('express');
const { getDashboard } = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get dashboard data (requires authentication)
router.get('/', authMiddleware, getDashboard);

module.exports = router;
