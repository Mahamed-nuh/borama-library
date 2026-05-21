import React, { useEffect, useMemo, useState } from 'react';
import { XMarkIcon, BookOpenIcon, TagIcon, LanguageIcon, HashtagIcon } from '@heroicons/react/24/outline';
import { bookAPI, categoryAPI } from '../services/api';

const LANGUAGE_OPTIONS = ['Somali', 'English', 'Arabic', 'French', 'Other'];

const AddBookModal = ({ onClose, onBookAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'History of Borama',
    language: 'Somali',
    quantity: 1,
  });
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const quantityValue = useMemo(() => Number.parseInt(formData.quantity, 10) || 1, [formData.quantity]);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await categoryAPI.list();
        const categories = response.data.categories || [];
        const names = categories.map((category) => category.name);

        if (!isMounted) return;

        setCategoryOptions(names);
        setFormData((previous) => ({
          ...previous,
          category: names.includes(previous.category) ? previous.category : names[0] || '',
        }));
      } catch (err) {
        if (isMounted) {
          setCategoryOptions([]);
          setError(err.response?.data?.message || 'Failed to load categories');
        }
      } finally {
        if (isMounted) {
          setCategoriesLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Please enter a book title');
      return;
    }

    if (!formData.author.trim()) {
      setError('Please enter an author name');
      return;
    }

    if (!formData.category.trim()) {
      setError('Please create a category first');
      return;
    }

    try {
      setLoading(true);
      await bookAPI.createBook({
        title: formData.title.trim(),
        author: formData.author.trim(),
        category: formData.category,
        language: formData.language,
        quantity: quantityValue,
      });

      onBookAdded();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-200 bg-gradient-to-r from-indigo-600 to-sky-600 px-6 py-5 text-white">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Book Management</p>
            <h2 className="mt-1 text-2xl font-bold">Add New Book</h2>
            <p className="mt-1 text-sm text-white/80">Keep entry focused on the core fields used across the library.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close add book modal"
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
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700" htmlFor="title">
                <BookOpenIcon className="h-4 w-4 text-indigo-600" />
                Book Name
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter book name"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700" htmlFor="author">
                <BookOpenIcon className="h-4 w-4 text-indigo-600" />
                Author
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Enter author name"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700" htmlFor="category">
                <TagIcon className="h-4 w-4 text-indigo-600" />
                Classification
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                disabled={loading || categoriesLoading || categoryOptions.length === 0}
              >
                {categoryOptions.length === 0 ? (
                  <option value="">No categories available</option>
                ) : (
                  categoryOptions.map((categoryOption) => (
                    <option key={categoryOption} value={categoryOption}>
                      {categoryOption}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700" htmlFor="language">
                <LanguageIcon className="h-4 w-4 text-indigo-600" />
                Language
              </label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                disabled={loading}
              >
                {LANGUAGE_OPTIONS.map((languageOption) => (
                  <option key={languageOption} value={languageOption}>
                    {languageOption}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700" htmlFor="quantity">
                <HashtagIcon className="h-4 w-4 text-indigo-600" />
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                step="1"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                disabled={loading}
              />
            </div>
          </div>

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
              {loading ? 'Adding Book...' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookModal;
