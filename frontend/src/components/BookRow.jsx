import React from 'react';

const BookRow = ({
  book,
  isEditing,
  onEdit,
  onCancelEdit,
  onStatusUpdate,
  onDelete,
}) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Available':
        return '✓';
      case 'Loaned':
        return '•';
      case 'Reserved':
        return '⟳';
      case 'Damaged':
        return '✕';
      default:
        return '';
    }
  };

  return (
    <tr className="transition-colors hover:bg-slate-50/80">
      <td className="px-6 py-5 align-top">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 text-lg text-white shadow-sm">
            📖
          </div>
          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold text-slate-900">{book.title}</h4>
            <p className="mt-1 text-sm text-slate-500">{book.author}</p>
            <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">{book.status}</p>
          </div>
        </div>
      </td>

      <td className="px-6 py-5 align-top">
        <div className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
          {book.category}
        </div>
      </td>

      <td className="px-6 py-5 align-top">
        <div className="text-sm font-medium text-slate-700">{book.language || 'Somali'}</div>
      </td>

      <td className="px-6 py-5 align-top">
        <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
          {book.quantity ?? 1}
        </div>
      </td>

      <td className="px-6 py-5 align-top">
        {isEditing ? (
          <div className="space-y-3">
            <select
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
              value={book.status}
              onChange={(e) => {
                onStatusUpdate(book._id, e.target.value);
                onCancelEdit();
              }}
            >
              <option value="Available">Available</option>
              <option value="Loaned">Loaned</option>
              <option value="Reserved">Reserved</option>
              <option value="Damaged">Damaged</option>
            </select>
            <button
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              onClick={onCancelEdit}
              type="button"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition ${
              book.status === 'Available'
                ? 'bg-emerald-50 text-emerald-700'
                : book.status === 'Loaned'
                  ? 'bg-amber-50 text-amber-700'
                  : book.status === 'Reserved'
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-rose-50 text-rose-700'
            }`}
            onClick={onEdit}
            type="button"
          >
            <span className="status-icon">{getStatusIcon(book.status)}</span>
            <span>{book.status}</span>
          </button>
        )}
      </td>

      <td className="px-6 py-5 align-top">
        <div className="flex items-center justify-end gap-2">
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            title="Edit"
            onClick={onEdit}
            type="button"
          >
            ✎
          </button>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-rose-200 text-rose-600 transition hover:bg-rose-50"
            title="Delete"
            onClick={() => onDelete(book._id)}
            type="button"
          >
            🗑
          </button>
        </div>
      </td>
    </tr>
  );
};

export default BookRow;
