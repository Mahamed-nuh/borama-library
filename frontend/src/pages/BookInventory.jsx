import React, { useState, useEffect } from 'react';
import { bookAPI } from '../services/api';
import AddBookModal from '../components/AddBookModal';
import BookTable from '../components/BookTable';
import '../styles/BookInventory.css';

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
    <div className="books-inventory-container">
      {/* Header Section */}
      <div className="inventory-header">
        <div className="header-top">
          <h1>Books Inventory</h1>
          <p>Manage and track the library's physical collection.</p>
        </div>
        <button className="btn-add-book" onClick={() => setShowAddModal(true)}>
          + Add New Book
        </button>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalVolumes}</div>
            <div className="stat-label">Total Volumes</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalAvailable}</div>
            <div className="stat-label">Currently Available</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <div className="stat-value">{stats.checkedOutToday}</div>
            <div className="stat-label">Checked Out Today</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <div className="stat-value">{stats.overdueBooks}</div>
            <div className="stat-label">Overdue Notices</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="inventory-main">
        {/* Sidebar with Categories and Filters */}
        <div className="inventory-sidebar">
          {/* Quick Categories */}
          <div className="quick-categories-section">
            <h3>QUICK CATEGORIES</h3>
            <div className="categories-list">
              <button
                className={`category-btn ${!category ? 'active' : ''}`}
                onClick={() => {
                  setCategory('');
                  setPage(1);
                }}
              >
                All Books
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  className={`category-btn ${category === cat.name ? 'active' : ''}`}
                  onClick={() => {
                    setCategory(cat.name);
                    setPage(1);
                  }}
                >
                  {cat.name}
                  <span className="category-count">{cat.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Refine Search */}
          <div className="refine-search-section">
            <h3>REFINE SEARCH</h3>

            {/* Status Filter */}
            <div className="filter-group">
              <label>Status</label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Statuses</option>
                <option value="Available">Available</option>
                <option value="Loaned">Loaned</option>
                <option value="Reserved">Reserved</option>
                <option value="Damaged">Damaged</option>
              </select>
            </div>

            {/* Location Filter */}
            <div className="filter-group">
              <label>Shelf Location</label>
              <input
                type="text"
                placeholder="Search location..."
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* Reset Filters */}
            <button
              className="btn-reset-filters"
              onClick={() => {
                setSearch('');
                setCategory('');
                setStatus('');
                setLocation('');
                setPage(1);
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="inventory-content">
          {/* Search Bar */}
          <div className="search-section">
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              className="search-input"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          {/* Loading */}
          {loading && <div className="loading-message">Loading books...</div>}

          {/* Books Table */}
          {!loading && (
            <>
              <BookTable
                books={books}
                onDelete={handleDelete}
                onStatusUpdate={handleStatusUpdate}
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="pagination-btn"
                  >
                    ← Previous
                  </button>

                  <div className="pagination-info">
                    Page {page} of {totalPages}
                  </div>

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="pagination-btn"
                  >
                    Next →
                  </button>
                </div>
              )}

              {/* No results */}
              {books.length === 0 && !loading && (
                <div className="no-results">No books found</div>
              )}
            </>
          )}
        </div>
      </div>

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
