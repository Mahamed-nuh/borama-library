// Dashboard page component
import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import '../styles/Dashboard.css';

const Dashboard = () => {
  // State for dashboard data
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Get user data from localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setUser(storedUser);

        // Fetch dashboard data from API (requires token)
        const response = await authAPI.dashboard();
        setStats(response.data.data.stats);
        setError('');
      } catch (err) {
        console.error('Error fetching dashboard:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  // Show error if any
  if (error) {
    return (
      <div className="error-container">
        <h2>⚠️ Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Sidebar userName={user?.name} />

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Header Section */}
        <div className="dashboard-header">
          <h1>Welcome, {user?.name}! 👋</h1>
          <p>Here's what's happening in the library today</p>
        </div>

        {/* Statistics Cards */}
        <div className="stats-container">
          {/* Total Users Card */}
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <p className="stat-label">Total Members</p>
              <p className="stat-value">{stats?.totalUsers || 0}</p>
              <p className="stat-change">+2 this week</p>
            </div>
          </div>

          {/* Total Books Card */}
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-info">
              <p className="stat-label">Total Books</p>
              <p className="stat-value">{stats?.totalBooks || 0}</p>
              <p className="stat-change">+5 new books</p>
            </div>
          </div>

          {/* Active Loans Card */}
          <div className="stat-card">
            <div className="stat-icon">📤</div>
            <div className="stat-info">
              <p className="stat-label">Active Loans</p>
              <p className="stat-value">{stats?.activeLoans || 0}</p>
              <p className="stat-change">+3 today</p>
            </div>
          </div>

          {/* Overdue Books Card */}
          <div className="stat-card stat-card-warning">
            <div className="stat-icon">⏰</div>
            <div className="stat-info">
              <p className="stat-label">Overdue Books</p>
              <p className="stat-value">{stats?.overdueBooks || 0}</p>
              <p className="stat-change">Action required</p>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="activity-section">
          <div className="section-header">
            <h2>📋 Recent Activity</h2>
            <a href="#" className="view-all">View All</a>
          </div>

          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-time">Just now</div>
              <div className="activity-content">
                <p className="activity-action">Welcome to Borama Library!</p>
                <p className="activity-desc">Your account has been created successfully</p>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-time">Today</div>
              <div className="activity-content">
                <p className="activity-action">New books added</p>
                <p className="activity-desc">5 new books have been added to the collection</p>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-time">Yesterday</div>
              <div className="activity-content">
                <p className="activity-action">Library reminder</p>
                <p className="activity-desc">Don't forget to return your borrowed books</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Info */}
        <div className="info-section">
          <div className="info-card">
            <h3>📖 About Borama Library</h3>
            <p>
              Borama Library is a digital library management system designed to help users browse,
              search, and borrow books easily. Visit us to explore our collection of books across
              various categories.
            </p>
          </div>

          <div className="info-card">
            <h3>❓ Need Help?</h3>
            <p>
              Check our FAQ section or contact the library staff. We're here to help you find
              the perfect book for your needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
