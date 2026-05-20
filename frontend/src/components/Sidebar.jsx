// Sidebar navigation component
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChartPieIcon, 
  BookOpenIcon, 
  TagIcon, 
  ClipboardDocumentListIcon, 
  Cog6ToothIcon, 
  ArrowLeftOnRectangleIcon 
} from '@heroicons/react/24/outline';

const Sidebar = ({ userName }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: ChartPieIcon },
    { name: 'Books Inventory', path: '/books', icon: BookOpenIcon },
    { name: 'Categories', path: '#', icon: TagIcon },
    { name: 'My Loans', path: '#', icon: ClipboardDocumentListIcon },
    { name: 'Settings', path: '#', icon: Cog6ToothIcon },
  ];

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col h-screen transform transition-transform duration-300 ease-in-out">
      {/* Logo Section */}
      <div className="flex flex-col items-center justify-center h-20 border-b border-slate-100 shrink-0">
        <h2 className="text-2xl font-bold tracking-tight text-indigo-600 flex items-center gap-2">
          <BookOpenIcon className="w-8 h-8" />
          Borama
        </h2>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Library System</p>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3 p-6 border-b border-slate-100 shrink-0">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 font-bold text-lg border border-indigo-100">
          {userName ? userName.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="flex flex-col overflow-hidden">
          <p className="text-sm font-semibold text-slate-900 truncate">{userName || 'User'}</p>
          <p className="text-xs font-medium text-slate-500">Member</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <a
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              {item.name}
            </a>
          );
        })}
      </nav>

      {/* Logout & Footer */}
      <div className="p-4 border-t border-slate-100 shrink-0">
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5" />
          Logout
        </button>
        <div className="mt-4 text-center">
          <p className="text-xs text-slate-400">© 2024 Borama Library</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
