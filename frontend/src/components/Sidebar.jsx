// Sidebar navigation component
import { useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = ({ userName }) => {
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    // Remove token and user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="sidebar">
      {/* Logo Section */}
      <div className="sidebar-header">
        <h2>📚 Borama</h2>
        <p>Library System</p>
      </div>

      {/* User Info */}
      <div className="user-info">
        <div className="user-avatar">👤</div>
        <div className="user-details">
          <p className="user-name">{userName || 'User'}</p>
          <p className="user-role">Member</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <a href="/dashboard" className="nav-item active">
          📊 Dashboard
        </a>
        <a href="/books" className="nav-item">
          📖 Books Inventory
        </a>
        <a href="#" className="nav-item">
          🏷️ Categories
        </a>
        <a href="#" className="nav-item">
          📋 My Loans
        </a>
        <a href="#" className="nav-item">
          ⚙️ Settings
        </a>
      </nav>

      {/* Logout Button */}
      <button className="logout-btn" onClick={handleLogout}>
        🚪 Logout
      </button>

      {/* Footer */}
      <div className="sidebar-footer">
        <p>© 2024 Borama Library</p>
      </div>
    </div>
  );
};

export default Sidebar;
