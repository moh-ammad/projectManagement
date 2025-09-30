import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { LogOut, User, Users, FolderOpen, BarChart3, Activity, Settings, CheckSquare, FileText, Bell, Menu, X } from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  const canAccessEmployees = user?.role === 'admin' || user?.role === 'manager'

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 mb-6 sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 w-full">
          {/* Logo/Brand */}
          <Link to="/dashboard" className="flex items-center hover:opacity-80 transition-opacity flex-shrink-0">
            <div className="flex items-center">
              <img 
                src="/logo.png" 
                alt="Digital Bevy" 
                className="h-8 w-8 mr-2 rounded-full object-contain"
              />
              <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent whitespace-nowrap">
                Digital Bevy
              </span>
            </div>
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center max-w-4xl">
            <Link 
              to="/dashboard" 
              className={`flex items-center space-x-1 px-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                isActive('/dashboard') 
                  ? 'text-primary-600 bg-primary-50 border border-primary-200' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              <BarChart3 size={14} />
              <span className="hidden xl:inline">Dashboard</span>
            </Link>
            
            {/* Tasks - For all roles */}
            <Link 
              to="/tasks" 
              className={`flex items-center space-x-1 px-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                isActive('/tasks') 
                  ? 'text-primary-600 bg-primary-50 border border-primary-200' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              <CheckSquare size={14} />
              <span className="hidden xl:inline">{user?.role === 'user' ? 'Tasks' : 'Tasks'}</span>
            </Link>
            
            {/* Projects - Only for Admin and Manager */}
            {(user?.role === 'admin' || user?.role === 'manager') && (
              <Link 
                to="/projects" 
                className={`flex items-center space-x-1 px-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive('/projects') 
                    ? 'text-primary-600 bg-primary-50 border border-primary-200' 
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <FolderOpen size={14} />
                <span className="hidden xl:inline">Projects</span>
              </Link>
            )}

            {/* Employees - Only for Admin and Manager */}
            {canAccessEmployees && (
              <Link 
                to="/users" 
                className={`flex items-center space-x-1 px-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive('/users') 
                    ? 'text-primary-600 bg-primary-50 border border-primary-200' 
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <Users size={14} />
                <span className="hidden xl:inline">Employees</span>
              </Link>
            )}

            {/* Notifications - For all roles */}
            <Link 
              to="/notifications" 
              className={`flex items-center space-x-1 px-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                isActive('/notifications') 
                  ? 'text-primary-600 bg-primary-50 border border-primary-200' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              <Bell size={14} />
              <span className="hidden xl:inline">Notifications</span>
            </Link>

            {/* Reports - Only for Admin and Manager */}
            {canAccessEmployees && (
              <Link 
                to="/reports" 
                className={`flex items-center space-x-1 px-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive('/reports') 
                    ? 'text-primary-600 bg-primary-50 border border-primary-200' 
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <FileText size={14} />
                <span className="hidden xl:inline">Reports</span>
              </Link>
            )}

            {/* Activities - Only for Admin and Manager */}
            {canAccessEmployees && (
              <Link 
                to="/activities" 
                className={`flex items-center space-x-1 px-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive('/activities') 
                    ? 'text-primary-600 bg-primary-50 border border-primary-200' 
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <Activity size={14} />
                <span className="hidden xl:inline">Activities</span>
              </Link>
            )}

            {/* Settings - Only for Admin */}
            {user?.role === 'admin' && (
              <Link 
                to="/settings" 
                className={`flex items-center space-x-1 px-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive('/settings') 
                    ? 'text-primary-600 bg-primary-50 border border-primary-200' 
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <Settings size={14} />
                <span className="hidden xl:inline">Settings</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-all duration-200"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* User Profile & Actions */}
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

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-1">
              <Link 
                to="/dashboard" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/dashboard') 
                    ? 'text-primary-600 bg-primary-50 border border-primary-200' 
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <BarChart3 size={16} />
                <span>Dashboard</span>
              </Link>
              
              <Link 
                to="/tasks" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/tasks') 
                    ? 'text-primary-600 bg-primary-50 border border-primary-200' 
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <CheckSquare size={16} />
                <span>{user?.role === 'user' ? 'My Tasks' : 'Tasks'}</span>
              </Link>
              
              {(user?.role === 'admin' || user?.role === 'manager') && (
                <Link 
                  to="/projects" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/projects') 
                      ? 'text-primary-600 bg-primary-50 border border-primary-200' 
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <FolderOpen size={16} />
                  <span>Projects</span>
                </Link>
              )}

              {canAccessEmployees && (
                <Link 
                  to="/users" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/users') 
                      ? 'text-primary-600 bg-primary-50 border border-primary-200' 
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <Users size={16} />
                  <span>Employees</span>
                </Link>
              )}

              <Link 
                to="/notifications" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/notifications') 
                    ? 'text-primary-600 bg-primary-50 border border-primary-200' 
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <Bell size={16} />
                <span>Notifications</span>
              </Link>

              {canAccessEmployees && (
                <>
                  <Link 
                    to="/reports" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive('/reports') 
                        ? 'text-primary-600 bg-primary-50 border border-primary-200' 
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    <FileText size={16} />
                    <span>Reports</span>
                  </Link>

                  <Link 
                    to="/activities" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive('/activities') 
                        ? 'text-primary-600 bg-primary-50 border border-primary-200' 
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    <Activity size={16} />
                    <span>Activities</span>
                  </Link>
                </>
              )}

              {user?.role === 'admin' && (
                <Link 
                  to="/settings" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/settings') 
                      ? 'text-primary-600 bg-primary-50 border border-primary-200' 
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </Link>
              )}

              {/* Mobile User Profile and Logout */}
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
                    logout()
                    setIsMobileMenuOpen(false)
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
  )
}

export default Navbar