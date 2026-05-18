// Book model - defines the structure of books in the library database
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a book title'],
    trim: true,
  },
  author: {
    type: String,
    required: [true, 'Please provide an author name'],
    trim: true,
  },
  isbn: {
    type: String,
    required: [true, 'Please provide an ISBN'],
    unique: true,
    trim: true,
  },
  category: {
    type: String,
    enum: [
      'History of Borama',
      'Somali Poetry',
      'Digital Systems',
      'Agriculture',
      'Literature',
      'Science',
      'Technology',
      'Arts',
      'Other',
    ],
    required: [true, 'Please provide a category'],
  },
  status: {
    type: String,
    enum: ['Available', 'Loaned', 'Reserved', 'Damaged'],
    default: 'Available',
  },
  location: {
    type: String,
    required: [true, 'Please provide a shelf location'],
    trim: true,
  },
  publisher: {
    type: String,
    trim: true,
  },
  publicationYear: {
    type: Number,
    min: 1000,
    max: new Date().getFullYear(),
  },
  pages: {
    type: Number,
    min: 1,
  },
  language: {
    type: String,
    default: 'Somali',
  },
  description: {
    type: String,
    trim: true,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 0,
  },
  availableQuantity: {
    type: Number,
    default: 1,
    min: 0,
  },
  borrowedBy: [
    {
      userId: mongoose.Schema.Types.ObjectId,
      borrowDate: Date,
      dueDate: Date,
      returnDate: Date,
    },
  ],
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
bookSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create and export the Book model
const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
