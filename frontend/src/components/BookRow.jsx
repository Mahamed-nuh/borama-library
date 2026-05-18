import React from 'react';
import '../styles/BookRow.css';

const BookRow = ({
  book,
  isEditing,
  onEdit,
  onCancelEdit,
  onStatusUpdate,
  onDelete,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'status-available';
      case 'Loaned':
        return 'status-loaned';
      case 'Reserved':
        return 'status-reserved';
      case 'Damaged':
        return 'status-damaged';
      default:
        return '';
    }
  };

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
    <tr className="book-row">
      {/* Resource Column */}
      <td className="resource-cell">
        <div className="resource-info">
          <div className="resource-cover">
            <div className="book-placeholder">📖</div>
          </div>
          <div className="resource-details">
            <h4 className="resource-title">{book.title}</h4>
            <p className="resource-author">{book.author}</p>
          </div>
        </div>
      </td>

      {/* Category & ISBN Column */}
      <td className="category-isbn-cell">
        <div className="category-badge">{book.category}</div>
        <div className="isbn-text">{book.isbn}</div>
      </td>

      {/* Status Column */}
      <td className="status-cell">
        {isEditing ? (
          <div className="status-edit">
            <select
              className="status-select"
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
            <button className="btn-cancel-edit" onClick={onCancelEdit}>
              Cancel
            </button>
          </div>
        ) : (
          <button
            className={`status-badge ${getStatusColor(book.status)}`}
            onClick={onEdit}
          >
            <span className="status-icon">{getStatusIcon(book.status)}</span>
            {book.status}
          </button>
        )}
      </td>

      {/* Location Column */}
      <td className="location-cell">
        <span className="location-text">{book.location}</span>
      </td>

      {/* Actions Column */}
      <td className="actions-cell">
        <button
          className="btn-action btn-edit"
          title="Edit"
          onClick={() => alert('Edit functionality coming soon')}
        >
          ✎
        </button>
        <button
          className="btn-action btn-delete"
          title="Delete"
          onClick={() => onDelete(book._id)}
        >
          🗑
        </button>
      </td>
    </tr>
  );
};

export default BookRow;
