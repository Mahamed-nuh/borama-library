// Dashboard controller - handles dashboard data
const User = require('../models/User');

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

    // Create dashboard data object
    const dashboardData = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      stats: {
        totalUsers: totalUsers,
        totalBooks: 145, // This will be dynamic when we add books
        activeLoans: 23,
        overdueBooks: 5,
      },
      recentActivity: [
        {
          id: 1,
          action: 'Registered',
          timestamp: user.createdAt,
        },
      ],
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
