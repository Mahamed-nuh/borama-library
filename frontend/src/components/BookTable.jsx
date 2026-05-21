import React, { useState } from 'react';
import BookRow from './BookRow';

const BookTable = ({ books, onDelete, onStatusUpdate }) => {
  const [editingId, setEditingId] = useState(null);

  return (
    <div className="overflow-hidden rounded-none md:rounded-b-2xl">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50/80 text-left">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Book</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Classification</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Language</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Quantity</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Status</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {books && books.length > 0 ? (
              books.map((book) => (
                <BookRow
                  key={book._id}
                  book={book}
                  isEditing={editingId === book._id}
                  onEdit={() => setEditingId(book._id)}
                  onCancelEdit={() => setEditingId(null)}
                  onStatusUpdate={onStatusUpdate}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-16 text-center text-sm text-slate-500">
                  No books found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookTable;
