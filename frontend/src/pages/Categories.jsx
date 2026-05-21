import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { categoryAPI } from '../services/api';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [success, setSuccess] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryAPI.list();
      setCategories(res.data.categories || []);
    } catch (err) {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (isCreating) return;
    if (!name.trim()) {
      setError('Please enter a category name');
      return;
    }
    try {
      setIsCreating(true);
      setError('');
      setSuccess('');
      await categoryAPI.create({ name: name.trim() });
      setName('');
      setSuccess('Category created');
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      await categoryAPI.delete(id);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
              <p className="text-sm text-slate-500">Manage book categories used across the library.</p>
            </div>
            <form onSubmit={handleCreate} className="flex items-center gap-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="New category name"
                className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm"
                disabled={isCreating}
              />
              <button
                type="submit"
                disabled={isCreating}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${isCreating ? 'bg-slate-300 text-slate-700' : 'bg-indigo-600 text-white'}`}
              >
                <PlusIcon className="w-4 h-4" /> {isCreating ? 'Adding...' : 'Add'}
              </button>
            </form>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            {loading ? (
              <div className="p-6 text-center">Loading...</div>
            ) : (
              <div className="space-y-2">
                {error && <div className="text-rose-600">{error}</div>}
                {success && <div className="text-emerald-600">{success}</div>}
                {categories.length === 0 ? (
                  <div className="p-6 text-center text-slate-500">No categories yet.</div>
                ) : (
                  <ul className="divide-y">
                    {categories.map((c) => (
                      <li key={c.id} className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <div className="text-sm font-medium text-slate-900">{c.name}</div>
                          <div className="text-xs text-slate-500">{c.count} books</div>
                        </div>
                        <div>
                          <button onClick={() => handleDelete(c.id)} className="text-rose-600 hover:text-rose-700 inline-flex items-center gap-2 text-sm">
                            <TrashIcon className="w-4 h-4" /> Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Categories;
