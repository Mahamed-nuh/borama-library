import React, { useState } from 'react';
import BookRow from './BookRow';
import '../styles/BookTable.css';

const BookTable = ({ books, onDelete, onStatusUpdate }) => {
  const [editingId, setEditingId] = useState(null);

  return (
    <div className="book-table-container">
      <table className="book-table">
        <thead>
          <tr>
            <th>RESOURCE</th>
            <th>CATEGORY & ISBN</th>
            <th>STATUS</th>
            <th>LOCATION</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
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
              <td colSpan="5" className="no-data">
                No books found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookTable;
