const express = require('express');
const router = express.Router();
const { listCategories, createCategory, deleteCategory } = require('../controllers/categoryController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, listCategories);
router.post('/', authMiddleware, createCategory);
router.delete('/:id', authMiddleware, deleteCategory);

module.exports = router;
