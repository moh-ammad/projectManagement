import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import {
  LogOut, User, Users, FolderOpen, BarChart3, Activity,
  Settings, CheckSquare, FileText, Bell, Menu, X, Server, Layers
} from 'lucide-react';

// You might pick an icon for "Services", e.g. Server or Layers
const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: BarChart3, roles: ['user','manager','admin'] },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare, roles: ['user','manager','admin'] },
  { to: '/services', label: 'Services', icon: Server, roles: ['user','manager','admin'] },
  { to: '/projects', label: 'Projects', icon: FolderOpen, roles: ['manager','admin'] },
  { to: '/users', label: 'Employees', icon: Users, roles: ['manager','admin'] },
  { to: '/notifications', label: 'Notifications', icon: Bell, roles: ['user','manager','admin'] },
  { to: '/reports', label: 'Reports', icon: FileText, roles: ['manager','admin'] },
  { to: '/activities', label: 'Activities', icon: Activity, roles: ['manager','admin'] },
  { to: '/settings', label: 'Settings', icon: Settings, roles: ['admin'] }
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 mb-6 sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 w-full">
          {/* Logo / Brand */}
          <Link
            to="/dashboard"
            className="flex items-center hover:opacity-80 transition-opacity flex-shrink-0"
          >
            <img
              src="/logo.png"
              alt="Logo"
              className="h-8 w-8 mr-2 rounded-full object-contain"
            />
            <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent whitespace-nowrap">
              MyBrand
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center max-w-4xl">
            {NAV_ITEMS.map(({ to, label, icon: Icon, roles }) => {
              if (!roles.includes(user?.role)) return null;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center space-x-1 px-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive(to)
                      ? 'text-primary-600 bg-primary-50 border border-primary-200'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={14} />
                  <span className="hidden xl:inline">{label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-all duration-200"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* User profile & logout (desktop) */}
          <div className="hidden lg:flex items-center space-x-2 flex-shrink-0">
            <Link
              to="/profile"
              className="flex items-center space-x-2 px-2 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-all duration-200"
            >
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 bg-gradient-to-br from-secondary-100 to-primary-100 rounded-full flex items-center justify-center border border-primary-200">
                  <User size={14} className="text-primary-600" />
                </div>
                <div className="hidden xl:block">
                  <div className="text-sm font-medium text-gray-900 truncate max-w-24">{user?.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
                </div>
              </div>
            </Link>

            <button
              onClick={logout}
              className="flex items-center space-x-1 px-2 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <LogOut size={14} />
              <span className="hidden xl:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Nav Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-1">
              {NAV_ITEMS.map(({ to, label, icon: Icon, roles }) => {
                if (!roles.includes(user?.role)) return null;
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(to)
                        ? 'text-primary-600 bg-primary-50 border border-primary-200'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                  </Link>
                );
              })}

              {/* Profile & Logout in mobile menu */}
              <div className="border-t border-gray-200 pt-3 mt-3">
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-all duration-200"
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-secondary-100 to-primary-100 rounded-full flex items-center justify-center border border-primary-200">
                    <User size={12} className="text-primary-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
                  </div>
                </Link>

                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 w-full"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
