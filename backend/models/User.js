// User model - defines the structure of users in the database
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'], // Validation: name is required
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true, // Each email must be unique
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email', // Regex validation for email
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false, // Don't return password by default in queries
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set creation time
  },
});

// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;
