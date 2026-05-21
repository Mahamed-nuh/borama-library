// Main server file - initializes Express app and connects to database
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const bookRoutes = require('./routes/books');
const categoryRoutes = require('./routes/categories');
const loanRoutes = require('./routes/loans');
const userRoutes = require('./routes/users');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use('/api/auth', authRoutes); // Authentication endpoints
app.use('/api/dashboard', dashboardRoutes); // Dashboard endpoints
app.use('/api/books', bookRoutes); // Book management endpoints
app.use('/api/categories', categoryRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/users', userRoutes); // Users endpoints

// Test route to check if server is running
app.get('/api/test', (req, res) => {
  res.json({ message: 'Borama Library API is running!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
