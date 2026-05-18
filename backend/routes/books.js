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

// Get inventory statistics
router.get('/stats', getInventoryStats);

// Get category counts
router.get('/categories/counts', getCategoryCounts);

// Get all books with search, filter, and pagination
router.get('/', getAllBooks);

// Get books by category
router.get('/category/:category', getBooksByCategory);

// Create a new book
router.post('/', createBook);

// Get a single book by ID
router.get('/:id', getBook);

// Update a book
router.put('/:id', updateBook);

// Delete a book
router.delete('/:id', deleteBook);

module.exports = router;
