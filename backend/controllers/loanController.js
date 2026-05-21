const Book = require('../models/Book');
const User = require('../models/User');

// Create a new loan (admin adds loan for a user)
exports.createLoan = async (req, res) => {
  try {
    const { bookId, borrowerName, borrowDate, dueDate } = req.body;

    if (!bookId || !borrowerName || !dueDate) {
      return res.status(400).json({ success: false, message: 'Book, borrower name, and due date are required' });
    }

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });

    if (book.availableQuantity <= 0) {
      return res.status(400).json({ success: false, message: 'No copies available for this book' });
    }

    const newBorrow = {
      borrowerName: borrowerName.trim(),
      borrowDate: borrowDate || new Date(),
      dueDate: new Date(dueDate),
      returnDate: null,
    };

    book.borrowedBy.push(newBorrow);
    book.availableQuantity -= 1;
    if (book.availableQuantity === 0) {
      book.status = 'Loaned';
    }
    await book.save();

    res.status(201).json({
      success: true,
      message: 'Loan created successfully',
      loan: {
        loanId: newBorrow._id,
        bookId: book._id,
        bookTitle: book.title,
        borrowerName: newBorrow.borrowerName,
        borrowDate: newBorrow.borrowDate,
        dueDate: newBorrow.dueDate,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating loan', error: error.message });
  }
};

// Get all loan records by flattening borrowedBy arrays
exports.getAllLoans = async (req, res) => {
  try {
    const books = await Book.find({ 'borrowedBy.0': { $exists: true } }).populate('addedBy', 'name');

    const loans = [];
    for (const book of books) {
      for (const borrow of book.borrowedBy) {
        loans.push({
          loanId: borrow._id,
          bookId: book._id,
          bookTitle: book.title,
          bookIsbn: book.isbn,
          borrowerName: borrow.borrowerName,
          borrowDate: borrow.borrowDate,
          dueDate: borrow.dueDate,
          returnDate: borrow.returnDate || null,
        });
      }
    }

    res.status(200).json({ success: true, loans });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching loans', error: error.message });
  }
};

// Mark a loan as returned by borrow subdocument id
exports.returnLoan = async (req, res) => {
  try {
    const { loanId } = req.params;
    const now = new Date();
    const result = await Book.updateOne(
      { 'borrowedBy._id': loanId },
      { $set: { 'borrowedBy.$.returnDate': now } }
    );
    if (result.matchedCount === 0) return res.status(404).json({ success: false, message: 'Loan not found' });
    res.status(200).json({ success: true, message: 'Loan marked returned' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error returning loan', error: error.message });
  }
};

// Extend a loan due date by days (body: days)
exports.extendLoan = async (req, res) => {
  try {
    const { loanId } = req.params;
    const { days = 7 } = req.body;
    const book = await Book.findOne({ 'borrowedBy._id': loanId });
    if (!book) return res.status(404).json({ success: false, message: 'Loan not found' });

    const borrow = book.borrowedBy.id(loanId);
    if (!borrow) return res.status(404).json({ success: false, message: 'Loan entry missing' });

    const newDue = new Date(borrow.dueDate || Date.now());
    newDue.setDate(newDue.getDate() + parseInt(days, 10));

    borrow.dueDate = newDue;
    await book.save();

    res.status(200).json({ success: true, message: 'Loan extended', dueDate: newDue });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error extending loan', error: error.message });
  }
};
