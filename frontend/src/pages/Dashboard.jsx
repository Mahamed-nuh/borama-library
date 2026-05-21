// Dashboard page component
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import { UsersIcon, BookOpenIcon, DocumentArrowUpIcon, ExclamationTriangleIcon, TagIcon } from '@heroicons/react/24/outline';

const formatRelativeTime = (timestamp) => {
  if (!timestamp) return 'Just now';

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return 'Just now';

  const diffInMinutes = Math.floor((Date.now() - date.getTime()) / 60000);

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString();
};

const Dashboard = () => {
  // State for dashboard data
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await authAPI.dashboard();
        const dashboardData = response.data.data;

        setUser(dashboardData.user);
        setStats(dashboardData.stats);
        setRecentActivity(dashboardData.recentActivity || []);
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
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-indigo-600 animate-spin"></div>
      </div>
    );
  }

  // Show error if any
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
        <ExclamationTriangleIcon className="w-16 h-16 text-rose-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Oops! Something went wrong</h2>
        <p className="text-slate-500 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar userName={user?.name} />

      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header Section */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome, {user?.name}! 👋</h1>
            <p className="mt-2 text-sm text-slate-500">Here's what's happening in your library today.</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <UsersIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Members</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.totalUsers || 0}</p>
                <p className="text-xs font-medium text-emerald-600 mt-1">Live from database</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <BookOpenIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Books</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.totalBooks || 0}</p>
                <p className="text-xs font-medium text-emerald-600 mt-1">Live from database</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
                <TagIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Categories</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.categories || 0}</p>
                <p className="text-xs font-medium text-emerald-600 mt-1">Defined in system</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <DocumentArrowUpIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Active Loans</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.activeLoans || 0}</p>
                <p className="text-xs font-medium text-emerald-600 mt-1">Currently loaned</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-rose-200 shadow-sm flex items-start gap-4 bg-rose-50/30">
              <div className="p-3 bg-rose-100 text-rose-600 rounded-xl">
                <ExclamationTriangleIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-rose-600">Overdue Books</p>
                <p className="text-2xl font-bold text-rose-700 mt-1">{stats?.overdueBooks || 0}</p>
                <p className="text-xs font-medium text-rose-500 mt-1">
                  {stats?.overdueBooks > 0 ? 'Action required' : 'No overdue items'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 cursor-default">
            {/* Recent Activity Section */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
                <Link to="/books" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All</Link>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm divide-y divide-slate-100 overflow-hidden">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="p-5 flex gap-4">
                      <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${activity.color || 'bg-indigo-500'}`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
                        <p className="text-sm text-slate-500 mt-1">{activity.description}</p>
                        <p className="text-xs font-medium text-slate-400 mt-2">{formatRelativeTime(activity.timestamp)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <BookOpenIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-slate-900">No recent activity yet</p>
                    <p className="text-sm text-slate-500 mt-1">Add books or create user actions to populate the feed.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats Info */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl p-6 shadow-sm border border-indigo-400">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <BookOpenIcon className="w-5 h-5 text-indigo-200" />
                  About Borama
                </h3>
                <p className="text-indigo-100 text-sm mt-3 leading-relaxed">
                  Borama Library is a digital library management system designed to help users browse,
                  search, and borrow books. Explore your live collection, manage inventory, and track activity.
                </p>
                <Link
                  to="/books"
                  className="inline-flex mt-4 items-center justify-center rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/25 transition-colors"
                >
                  Open Inventory
                </Link>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg text-slate-900 flex items-center gap-2">
                  <UsersIcon className="w-5 h-5 text-slate-400" />
                  Need Help?
                </h3>
                <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                  Check the books inventory for live records or contact staff for support with loans and updates.
                </p>
                <Link
                  to="/books"
                  className="inline-flex mt-4 items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Manage Books
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
