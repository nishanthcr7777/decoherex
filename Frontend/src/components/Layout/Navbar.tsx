import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, 
  Activity, 
  Server, 
  User, 
  BarChart3, 
  Settings, 
  LogOut,
  Zap
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const userNavItems = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/tracking', icon: Activity, label: 'Job Tracking' },
    { to: '/backends', icon: Server, label: 'Backends' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  const adminNavItems = [
    ...userNavItems,
    { to: '/admin/analytics', icon: Settings, label: 'Admin Analytics' },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : userNavItems;

  const isActivePath = (path: string) => location.pathname === path;

  if (!user) return null;

  return (
    <nav className="bg-slate-900 border-r border-slate-800 w-64 min-h-screen flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Zap className="w-8 h-8 text-cyan-400" />
          <span className="text-xl font-bold text-white">Quantum Jobs</span>
        </div>
        <p className="text-sm text-gray-400 mt-1">FlightRadar for Quantum</p>
      </div>

      <div className="flex-1 py-6">
        <div className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(item.to);
            
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`
                  flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-cyan-500/10 text-cyan-400 shadow-lg shadow-cyan-500/20 border-l-4 border-cyan-400' 
                    : 'text-gray-300 hover:bg-slate-800 hover:text-cyan-400 hover:shadow-md hover:shadow-cyan-500/10'
                  }
                `}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-cyan-400' : ''}`} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
            <span className="text-sm font-semibold text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="flex items-center w-full px-3 py-2 text-sm text-gray-300 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors duration-200"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;