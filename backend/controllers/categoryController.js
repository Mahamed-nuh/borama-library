const Category = require('../models/Category');
const Book = require('../models/Book');

// List categories with counts
exports.listCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    // attach counts from books
    const results = await Promise.all(
      categories.map(async (cat) => ({
        id: cat._id,
        name: cat.name,
        count: await Book.countDocuments({ category: cat.name }),
      }))
    );

    res.status(200).json({ success: true, categories: results });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching categories', error: error.message });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Category name required' });

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) return res.status(400).json({ success: false, message: 'Category already exists' });

    const cat = await Category.create({ name: name.trim() });
    res.status(201).json({ success: true, category: cat });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating category', error: error.message });
  }
};

// Delete a category (reject if books exist)
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    const booksCount = await Book.countDocuments({ category: category.name });
    if (booksCount > 0) {
      return res.status(400).json({ success: false, message: 'Cannot delete category with assigned books' });
    }

    await Category.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting category', error: error.message });
  }
};
