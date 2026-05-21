// Axios API service - handles all API calls to backend
import axios from 'axios';

// Create axios instance with base URL pointing to backend
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add token to requests if it exists in localStorage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API functions
export const authAPI = {
  // Register new user
  register: (data) => API.post('/auth/register', data),

  // Login user
  login: (data) => API.post('/auth/login', data),

  // Get current user (requires authentication)
  getCurrentUser: () => API.get('/auth/me'),

  // Get dashboard data (requires authentication)
  dashboard: () => API.get('/dashboard'),
};

// Book API functions
export const bookAPI = {
  // Get all books with search, filter, and pagination
  getAllBooks: (params) => API.get('/books', { params }),

  // Get a single book by ID
  getBook: (id) => API.get(`/books/${id}`),

  // Create a new book
  createBook: (data) => API.post('/books', data),

  // Update a book
  updateBook: (id, data) => API.put(`/books/${id}`, data),

  // Delete a book
  deleteBook: (id) => API.delete(`/books/${id}`),

  // Get books by category
  getBooksByCategory: (category, params) =>
    API.get(`/books/category/${category}`, { params }),

  // Get category counts
  getCategoryCounts: () => API.get('/books/categories/counts'),

  // Get inventory statistics
  getInventoryStats: () => API.get('/books/stats'),
};

// Categories API
export const categoryAPI = {
  list: () => API.get('/categories'),
  create: (data) => API.post('/categories', data),
  delete: (id) => API.delete(`/categories/${id}`),
};

// Loans API
export const loanAPI = {
  list: () => API.get('/loans'),
  create: (data) => API.post('/loans', data),
  returnBook: (loanId) => API.put(`/loans/${loanId}/return`),
  extendLoan: (loanId, days = 7) => API.put(`/loans/${loanId}/extend`, { days }),
};

// Users API
export const userAPI = {
  list: () => API.get('/users'),
  getUser: (id) => API.get(`/users/${id}`),
};

export default API;
