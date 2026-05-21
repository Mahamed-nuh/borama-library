const express = require('express');
const { listUsers, getUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all users
router.get('/', authMiddleware, listUsers);

// Get user by ID
router.get('/:id', authMiddleware, getUser);

module.exports = router;
