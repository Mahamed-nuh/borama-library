// Book routes - defines all book-related endpoints
const express = require('express');
const router = express.Router();
const {
  getAllBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  getBooksByCategory,
  getCategoryCounts,
  getInventoryStats,
} = require('../controllers/bookController');
const authMiddleware = require('../middleware/auth');

// Get inventory statistics
router.get('/stats', authMiddleware, getInventoryStats);

// Get category counts
router.get('/categories/counts', authMiddleware, getCategoryCounts);

// Get all books with search, filter, and pagination
router.get('/', authMiddleware, getAllBooks);

// Get books by category
router.get('/category/:category', authMiddleware, getBooksByCategory);

// Create a new book
router.post('/', authMiddleware, createBook);

// Get a single book by ID
router.get('/:id', authMiddleware, getBook);

// Update a book
router.put('/:id', authMiddleware, updateBook);

// Delete a book
router.delete('/:id', authMiddleware, deleteBook);

module.exports = router;
