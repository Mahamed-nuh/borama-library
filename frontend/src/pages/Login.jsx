// Login page component
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import '../styles/Login.css';

const Login = () => {
  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Form validation function
  const validateForm = () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email');
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Call login API
      const response = await authAPI.login({ email, password });

      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirect to dashboard (we'll create this later)
      navigate('/dashboard');
    } catch (err) {
      // Display error message from backend
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Header */}
        <div className="login-header">
          <h1>📚 Borama Library</h1>
          <p>Sign in to access your account</p>
        </div>

        {/* Error message display */}
        {error && <div className="error-message">{error}</div>}

        {/* Login form */}
        <form onSubmit={handleSubmit}>
          {/* Email input */}
          <div className="form-group">
            <label htmlFor="email">Email Address or Username</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Password input */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Remember me and forgot password */}
          <div className="remember-forgot">
            <div className="checkbox-group">
              <input type="checkbox" id="remember" disabled={loading} />
              <label htmlFor="remember">Remember me</label>
            </div>
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          {/* Login button */}
          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? <span className="loading"></span> : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="divider">or</div>

        {/* Register link */}
        <div className="login-footer">
          Don't have an account?{' '}
          <Link to="/register">Register Here</Link>
        </div>

        {/* Footer text */}
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#999' }}>
          © 2024 Borama Library Management System
        </p>
      </div>
    </div>
  );
};

export default Login;
