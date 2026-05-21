import React, { useEffect, useState } from 'react';
import { XMarkIcon, BookOpenIcon, UserIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { loanAPI, bookAPI } from '../services/api';

const AddLoanModal = ({ onClose, onLoanAdded }) => {
  const [formData, setFormData] = useState({
    bookId: '',
    borrowerName: '', // Changed from userId/userName to just borrowerName
    borrowDate: new Date().toISOString().split('T')[0],
    dueDate: '',
  });

  const [books, setBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setBooksLoading(true);
        const res = await bookAPI.getAllBooks({ limit: 100 });
        const availableBooks = (res.data.books || []).filter((b) => b.availableQuantity > 0);
        setBooks(availableBooks);
      } catch (err) {
        setError('Failed to load books');
      } finally {
        setBooksLoading(false);
      }
    };

    loadData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'bookId') {
      const selected = books.find((b) => b._id === value);
      if (selected && !formData.dueDate) {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14);
        setFormData((prev) => ({
          ...prev,
          dueDate: dueDate.toISOString().split('T')[0],
        }));
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!formData.bookId) {
      setError('Please select a book');
      return;
    }

    if (!formData.borrowerName.trim()) {
      setError('Please enter the borrower name');
      return;
    }

    if (!formData.dueDate) {
      setError('Please set a due date');
      return;
    }

    try {
      setLoading(true);
      await loanAPI.create({
        bookId: formData.bookId,
        borrowerName: formData.borrowerName.trim(),
        borrowDate: new Date(formData.borrowDate),
        dueDate: new Date(formData.dueDate),
      });

      onLoanAdded();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create loan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const daysUntilDue = formData.dueDate
    ? Math.ceil((new Date(formData.dueDate) - new Date(formData.borrowDate)) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-200 bg-indigo-600 px-6 py-5 text-white">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Loan Management</p>
            <h2 className="mt-1 text-2xl font-bold">Create New Loan</h2>
            <p className="mt-1 text-sm text-white/80">Enter borrower details and book information.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close add loan modal"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 p-6 md:p-8">
          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700" htmlFor="bookId">
                <BookOpenIcon className="h-4 w-4 text-emerald-600" />
                Select Book
              </label>
              <select
                id="bookId"
                name="bookId"
                value={formData.bookId}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                disabled={loading || booksLoading}
                required
              >
                <option value="">
                  {booksLoading ? 'Loading books...' : 'Choose a book...'}
                </option>
                {books.map((book) => (
                  <option key={book._id} value={book._id}>
                    {book.title} ({book.availableQuantity} available)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700" htmlFor="borrowerName">
                <UserIcon className="h-4 w-4 text-indigo-600" />
                Borrower Name
              </label>
              <input
                type="text"
                id="borrowerName"
                name="borrowerName"
                value={formData.borrowerName}
                onChange={handleChange}
                placeholder="Enter borrower's full name"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700" htmlFor="borrowDate">
                <CalendarIcon className="h-4 w-4 text-indigo-600" />
                Borrow Date
              </label>
              <input
                type="date"
                id="borrowDate"
                name="borrowDate"
                value={formData.borrowDate}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700" htmlFor="dueDate">
                <CalendarIcon className="h-4 w-4 text-indigo-600" />
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                disabled={loading}
                required
              />
            </div>
          </div>

          {daysUntilDue > 0 && (
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 text-sm text-slate-600">
              <strong>Loan Duration:</strong> {daysUntilDue} day{daysUntilDue !== 1 ? 's' : ''}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              disabled={loading}
            >
              {loading ? 'Creating Loan...' : 'Create Loan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLoanModal;
