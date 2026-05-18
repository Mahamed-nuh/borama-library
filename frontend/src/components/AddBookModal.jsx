import React, { useState } from 'react';
import { bookAPI } from '../services/api';
import '../styles/AddBookModal.css';

const AddBookModal = ({ onClose, onBookAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'History of Borama',
    location: '',
    publisher: '',
    publicationYear: new Date().getFullYear(),
    pages: '',
    language: 'Somali',
    description: '',
    quantity: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    'History of Borama',
    'Somali Poetry',
    'Digital Systems',
    'Agriculture',
    'Literature',
    'Science',
    'Technology',
    'Arts',
    'Other',
  ];

  const languages = ['Somali', 'English', 'Arabic', 'French', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.title.trim()) {
      setError('Please enter a book title');
      return;
    }
    if (!formData.author.trim()) {
      setError('Please enter an author name');
      return;
    }
    if (!formData.isbn.trim()) {
      setError('Please enter an ISBN');
      return;
    }
    if (!formData.location.trim()) {
      setError('Please enter a shelf location');
      return;
    }

    try {
      setLoading(true);
      await bookAPI.createBook({
        ...formData,
        pages: formData.pages ? parseInt(formData.pages) : undefined,
        publicationYear: parseInt(formData.publicationYear),
        quantity: parseInt(formData.quantity) || 1,
      });

      onBookAdded();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to create book. Please check if ISBN is unique.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Book</h2>
          <button className="btn-close" onClick={onClose}>
            ×
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="add-book-form">
          {/* Required Fields */}
          <div className="form-section">
            <h3>Required Information</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">
                  Book Title <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter book title"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="author">
                  Author <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Enter author name"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="isbn">
                  ISBN <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="isbn"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  placeholder="e.g., 978-3-16-148410-0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">
                  Shelf Location <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Main Hall, Shelf A - 102"
                  required
                />
              </div>
            </div>
          </div>

          {/* Category and Language */}
          <div className="form-section">
            <h3>Classification</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="language">Language</label>
                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Publisher Information */}
          <div className="form-section">
            <h3>Publisher Information</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="publisher">Publisher</label>
                <input
                  type="text"
                  id="publisher"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleChange}
                  placeholder="Publisher name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="publicationYear">Publication Year</label>
                <input
                  type="number"
                  id="publicationYear"
                  name="publicationYear"
                  value={formData.publicationYear}
                  onChange={handleChange}
                  min="1000"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="pages">Number of Pages</label>
                <input
                  type="number"
                  id="pages"
                  name="pages"
                  value={formData.pages}
                  onChange={handleChange}
                  min="1"
                  placeholder="e.g., 350"
                />
              </div>

              <div className="form-group">
                <label htmlFor="quantity">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  placeholder="Number of copies"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="form-section">
            <h3>Description</h3>

            <div className="form-group full-width">
              <label htmlFor="description">Book Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter a brief description of the book..."
                rows="4"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
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
