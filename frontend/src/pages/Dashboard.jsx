// Dashboard page component
import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import { UsersIcon, BookOpenIcon, DocumentArrowUpIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <UsersIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Members</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.totalUsers || 0}</p>
                <p className="text-xs font-medium text-emerald-600 mt-1">+2 this week</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <BookOpenIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Books</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.totalBooks || 0}</p>
                <p className="text-xs font-medium text-emerald-600 mt-1">+5 new books</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <DocumentArrowUpIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Active Loans</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.activeLoans || 0}</p>
                <p className="text-xs font-medium text-emerald-600 mt-1">+3 today</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-rose-200 shadow-sm flex items-start gap-4 bg-rose-50/30">
              <div className="p-3 bg-rose-100 text-rose-600 rounded-xl">
                <ExclamationTriangleIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-rose-600">Overdue Books</p>
                <p className="text-2xl font-bold text-rose-700 mt-1">{stats?.overdueBooks || 0}</p>
                <p className="text-xs font-medium text-rose-500 mt-1">Action required</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 cursor-default">
            {/* Recent Activity Section */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All</a>
              </div>
              
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm divide-y divide-slate-100">
                <div className="p-5 flex gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500 shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">Welcome to Borama Library!</p>
                    <p className="text-sm text-slate-500 mt-1">Your account has been created successfully</p>
                    <p className="text-xs font-medium text-slate-400 mt-2">Just now</p>
                  </div>
                </div>
                
                <div className="p-5 flex gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">New books added</p>
                    <p className="text-sm text-slate-500 mt-1">5 new books have been added to the collection</p>
                    <p className="text-xs font-medium text-slate-400 mt-2">Today, 10:42 AM</p>
                  </div>
                </div>

                <div className="p-5 flex gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-amber-500 shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">Library reminder</p>
                    <p className="text-sm text-slate-500 mt-1">Don't forget to return your borrowed books</p>
                    <p className="text-xs font-medium text-slate-400 mt-2">Yesterday</p>
                  </div>
                </div>
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
                  search, and borrow books. Explore our collection of titles curated just for you.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg text-slate-900 flex items-center gap-2">
                  <UsersIcon className="w-5 h-5 text-slate-400" />
                  Need Help?
                </h3>
                <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                  Check our FAQ section or contact staff. We're here to help you find your next great read!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
