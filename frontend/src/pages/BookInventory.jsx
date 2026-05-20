import React, { useState, useEffect } from 'react';
import { bookAPI } from '../services/api';
import AddBookModal from '../components/AddBookModal';
import BookTable from '../components/BookTable';
import Sidebar from '../components/Sidebar';
import { MagnifyingGlassIcon, PlusIcon, FunnelIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const BookInventory = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Filters and pagination
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [user, setUser] = useState(null);

  // Stats
  const [stats, setStats] = useState({
    totalVolumes: 0,
    totalAvailable: 0,
    checkedOutToday: 0,
    overdueBooks: 0,
  });

  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch books
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = {
        search,
        category,
        status,
        location,
        sortBy,
        order,
        page,
        limit,
      };

      const response = await bookAPI.getAllBooks(params);
      setBooks(response.data.books);
      setTotalPages(response.data.pages);
      setError(null);
    } catch (err) {
      setError('Failed to fetch books');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats and categories
  const fetchStats = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if(storedUser) setUser(storedUser);

      const [statsRes, categoriesRes] = await Promise.all([
        bookAPI.getInventoryStats(),
        bookAPI.getCategoryCounts(),
      ]);

      setStats(statsRes.data.stats);
      setCategories(categoriesRes.data.categories);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  // Initial load
  useEffect(() => {
    fetchBooks();
    fetchStats();
  }, [search, category, status, location, sortBy, order, page, limit]);

  // Handle book added
  const handleBookAdded = () => {
    setShowAddModal(false);
    setPage(1);
    fetchBooks();
    fetchStats();
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await bookAPI.deleteBook(id);
        fetchBooks();
        fetchStats();
      } catch (err) {
        alert('Failed to delete book');
      }
    }
  };

  // Handle status update
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await bookAPI.updateBook(id, { status: newStatus });
      fetchBooks();
      fetchStats();
    } catch (err) {
      alert('Failed to update book status');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userName={user?.name} />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Books Inventory</h1>
              <p className="mt-1 text-sm text-slate-500">Manage and track the library's physical collection.</p>
            </div>
            <button 
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-indigo-700 transition-colors shadow-sm"
              onClick={() => setShowAddModal(true)}
            >
              <PlusIcon className="w-5 h-5" />
              Add New Book
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
              <span className="text-sm font-medium text-slate-500">Total Volumes</span>
              <span className="text-3xl font-bold text-slate-900 mt-2">{stats.totalVolumes}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
              <span className="text-sm font-medium text-slate-500">Currently Available</span>
              <span className="text-3xl font-bold text-emerald-600 mt-2">{stats.totalAvailable}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
              <span className="text-sm font-medium text-slate-500">Checked Out Today</span>
              <span className="text-3xl font-bold text-blue-600 mt-2">{stats.checkedOutToday}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-rose-200 bg-rose-50/30 shadow-sm flex flex-col">
              <span className="text-sm font-medium text-rose-600">Overdue Notices</span>
              <span className="text-3xl font-bold text-rose-700 mt-2">{stats.overdueBooks}</span>
            </div>
          </div>

          {/* Main Content Layout */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Filtering Sidebar */}
            <div className="w-full lg:w-64 shrink-0 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2 font-semibold text-slate-700 text-sm uppercase tracking-wider">
                  <FunnelIcon className="w-4 h-4 text-slate-400" />
                  Filters
                </div>
                
                <div className="p-4 space-y-6">
                  {/* Category Filter */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase">Categories</h3>
                    <div className="flex flex-col space-y-1">
                      <button
                        className={`text-left px-3 py-2 rounded-lg text-sm transition-colors flex justify-between items-center ${
                          !category ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                        onClick={() => { setCategory(''); setPage(1); }}
                      >
                        All Books
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat.name}
                          className={`text-left px-3 py-2 rounded-lg text-sm transition-colors flex justify-between items-center group ${
                            category === cat.name ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-50'
                          }`}
                          onClick={() => { setCategory(cat.name); setPage(1); }}
                        >
                          <span className="truncate pr-2">{cat.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            category === cat.name ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                          }`}>
                            {cat.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Status</label>
                    <select
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none transition-shadow"
                      value={status}
                      onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                    >
                      <option value="">All Statuses</option>
                      <option value="Available">Available</option>
                      <option value="Loaned">Loaned</option>
                      <option value="Reserved">Reserved</option>
                      <option value="Damaged">Damaged</option>
                    </select>
                  </div>

                  {/* Location Filter */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Shelf Location</label>
                    <input
                      type="text"
                      placeholder="Search location..."
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none transition-shadow placeholder:text-slate-400"
                      value={location}
                      onChange={(e) => { setLocation(e.target.value); setPage(1); }}
                    />
                  </div>

                  <button
                    className="w-full flex justify-center items-center gap-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg py-2 hover:bg-slate-50 transition-colors"
                    onClick={() => {
                      setSearch('');
                      setCategory('');
                      setStatus('');
                      setLocation('');
                      setPage(1);
                    }}
                  >
                    <ArrowPathIcon className="w-4 h-4" />
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>

            {/* List & Table */}
            <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-w-0">
              
              {/* Search Header */}
              <div className="p-4 border-b border-slate-200 bg-white flex items-center gap-3">
                <div className="relative flex-1 max-w-lg">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="w-5 h-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow transition-colors"
                    placeholder="Search by title, author, or ISBN..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  />
                </div>
              </div>

              {/* Data Status & Table */}
              <div className="p-0 overflow-x-auto min-h-[400px]">
                {error && (
                  <div className="p-8 text-center text-rose-600 text-sm font-medium">{error}</div>
                )}
                {loading && (
                  <div className="p-12 flex justify-center items-center">
                    <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-indigo-600 animate-spin"></div>
                  </div>
                )}
                {!loading && books.length === 0 && !error && (
                  <div className="p-16 text-center flex flex-col items-center">
                    <BookOpenIcon className="w-12 h-12 text-slate-300 mb-3" />
                    <p className="text-slate-500 font-medium">No books found</p>
                    <p className="text-sm text-slate-400 mt-1">Try adjusting your filters or search term</p>
                  </div>
                )}
                {!loading && books.length > 0 && (
                  <div className="w-full">
                    {/* Assuming BookTable is also updated or handles its own generic styling. */}
                    <BookTable
                      books={books}
                      onDelete={handleDelete}
                      onStatusUpdate={handleStatusUpdate}
                    />
                  </div>
                )}
              </div>

              {/* Pagination Footer */}
              {!loading && totalPages > 1 && books.length > 0 && (
                <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>

                  <span className="text-sm font-medium text-slate-600">
                    Page {page} of {totalPages}
                  </span>

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      {/* Add Book Modal */}
      {showAddModal && (
        <AddBookModal
          onClose={() => setShowAddModal(false)}
          onBookAdded={handleBookAdded}
        />
      )}
    </div>
  );
};

export default BookInventory;
