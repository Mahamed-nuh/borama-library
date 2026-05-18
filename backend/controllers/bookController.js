// Book controller - handles all book-related operations
const Book = require('../models/Book');

// Get all books with search and filtering
exports.getAllBooks = async (req, res) => {
  try {
    const {
      search,
      category,
      status,
      location,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10,
    } = req.query;

    // Build filter object
    let filter = {};

    // Search by title, author, or ISBN
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by status
    if (status) {
      filter.status = status;
    }

    // Filter by location
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination
    const total = await Book.countDocuments(filter);

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = order === 'asc' ? 1 : -1;

    // Fetch books with pagination and sorting
    const books = await Book.find(filter)
      .populate('addedBy', 'name email')
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .exec();

    res.status(200).json({
      success: true,
      count: books.length,
      total,
      pages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching books',
      error: error.message,
    });
  }
};

// Get a single book by ID
exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('addedBy', 'name email');

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    res.status(200).json({
      success: true,
      book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching book',
      error: error.message,
    });
  }
};

// Create a new book
exports.createBook = async (req, res) => {
  try {
    const {
      title,
      author,
      isbn,
      category,
      location,
      publisher,
      publicationYear,
      pages,
      language,
      description,
      quantity,
    } = req.body;

    // Validation
    if (!title || !author || !isbn || !category || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (title, author, isbn, category, location)',
      });
    }

    // Check if book already exists
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: 'A book with this ISBN already exists',
      });
    }

    // Create book
    const book = await Book.create({
      title,
      author,
      isbn,
      category,
      location,
      publisher,
      publicationYear,
      pages,
      language: language || 'Somali',
      description,
      quantity: quantity || 1,
      availableQuantity: quantity || 1,
      addedBy: req.user ? req.user.id : null, // From auth middleware
    });

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating book',
      error: error.message,
    });
  }
};

// Update a book
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Find and update book
    const book = await Book.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate('addedBy', 'name email');

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating book',
      error: error.message,
    });
  }
};

// Delete a book
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting book',
      error: error.message,
    });
  }
};

// Get books by category
exports.getBooksByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Book.countDocuments({ category });

    const books = await Book.find({ category })
      .populate('addedBy', 'name email')
      .skip(skip)
      .limit(limitNum)
      .exec();

    res.status(200).json({
      success: true,
      count: books.length,
      total,
      pages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching books by category',
      error: error.message,
    });
  }
};

// Get category counts (for quick categories)
exports.getCategoryCounts = async (req, res) => {
  try {
    const categories = [
      'History of Borama',
      'Somali Poetry',
      'Digital Systems',
      'Agriculture',
      'Literature',
      'Science',
      'Technology',
      'Arts',
    ];

    const counts = await Promise.all(
      categories.map(async (cat) => ({
        name: cat,
        count: await Book.countDocuments({ category: cat }),
      }))
    );

    res.status(200).json({
      success: true,
      categories: counts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching category counts',
      error: error.message,
    });
  }
};

// Get inventory statistics
exports.getInventoryStats = async (req, res) => {
  try {
    const totalVolumes = await Book.countDocuments();
    const availableBooks = await Book.countDocuments({ status: 'Available' });
    const loanedBooks = await Book.countDocuments({ status: 'Loaned' });

    // Get total available quantity (sum of all available quantities)
    const availableResult = await Book.aggregate([
      { $group: { _id: null, total: { $sum: '$availableQuantity' } } },
    ]);

    const totalAvailable = availableResult[0]?.total || 0;

    // Get books checked out today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkedOutToday = await Book.find({
      'borrowedBy.borrowDate': {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    }).countDocuments();

    // Get overdue books
    const now = new Date();
    const overdueBooks = await Book.find({
      'borrowedBy.dueDate': { $lt: now },
      'borrowedBy.returnDate': null,
    }).countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        totalVolumes,
        availableBooks,
        loanedBooks,
        totalAvailable,
        checkedOutToday,
        overdueBooks,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching inventory statistics',
      error: error.message,
    });
  }
};
