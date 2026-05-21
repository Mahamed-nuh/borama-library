// Dashboard controller - handles dashboard data
const User = require('../models/User');

const Book = require('../models/Book');
const Category = require('../models/Category');

// Get dashboard stats and user info
exports.getDashboard = async (req, res) => {
  try {
    // Get current user from the token (added by auth middleware)
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get total users count (for statistics)
    const totalUsers = await User.countDocuments();
    
    // Get total books count
    const totalBooks = await Book.countDocuments();
    // Get total categories count
    const categoriesCount = await Category.countDocuments();
    
    // Get active loans count (assuming status 'Loaned')
    const activeLoans = await Book.countDocuments({ status: 'Loaned' });
    
    // Get overdue books count (this is a simplification, assumes 'Loaned' and overdue date, but let's say checking borrowedBy with past dueDate hasn't been returned)
    // Actually, Book has borrowedBy array with dueDate, we can just query books where any borrowedBy item has dueDate < now and returnDate is null
    const overdueBooks = await Book.countDocuments({
      borrowedBy: {
        $elemMatch: {
          dueDate: { $lt: new Date() },
          returnDate: { $exists: false }
        }
      }
    });

    // Fetch recent books for activity
    const recentBooks = await Book.find().sort({ createdAt: -1 }).limit(3);
    const recentActivity = recentBooks.map((book, idx) => ({
      id: book._id,
      title: 'New book added',
      description: `"${book.title}" was added to the collection`,
      timestamp: book.createdAt,
      type: 'book',
      color: idx === 0 ? 'bg-indigo-500' : idx === 1 ? 'bg-blue-500' : 'bg-emerald-500'
    }));

    // If no recent books, fallback to welcome message
    if (recentActivity.length === 0) {
      recentActivity.push({
        id: user._id,
        title: 'Welcome to Borama Library!',
        description: 'Your account has been created successfully',
        timestamp: user.createdAt,
        type: 'user',
        color: 'bg-indigo-500'
      });
    }

    // Create dashboard data object
    const dashboardData = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      stats: {
        totalUsers: totalUsers,
        totalBooks: totalBooks,
        categories: categoriesCount,
        activeLoans: activeLoans,
        overdueBooks: overdueBooks,
      },
      recentActivity: recentActivity,
    };

    res.status(200).json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard: ' + error.message,
    });
  }
};
