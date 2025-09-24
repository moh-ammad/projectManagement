import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { LogOut, User, Users, FolderOpen, BarChart3, Activity, Settings, CheckSquare, FileText } from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const canAccessUsers = user?.role === 'admin' || user?.role === 'manager'

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link to="/dashboard" className="flex items-center hover:opacity-80 transition-opacity">
            <div className="flex items-center">
              <img 
                src="/logo.png" 
                alt="Digital Bevy" 
                className="h-8 w-8 mr-3 rounded-full object-contain"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Digital Bevy
              </span>
            </div>
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              to="/dashboard" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/dashboard') 
                  ? 'text-primary-600 bg-primary-50 shadow-sm' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              <BarChart3 size={18} />
              <span>Home</span>
            </Link>
            
            {canAccessUsers && (
              <Link 
                to="/users" 
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/users') 
                    ? 'text-primary-600 bg-primary-50 shadow-sm' 
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <Users size={18} />
                <span>Users</span>
              </Link>
            )}
            
            {/* Projects - Only for Admin and Manager */}
            {user?.role !== 'user' && (
              <Link 
                to="/projects" 
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/projects') 
                    ? 'text-primary-600 bg-primary-50 shadow-sm' 
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <FolderOpen size={18} />
                <span>Projects</span>
              </Link>
            )}

            {/* Tasks - For all roles */}
            <Link 
              to="/tasks" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/tasks') 
                  ? 'text-primary-600 bg-primary-50 shadow-sm' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              <CheckSquare size={18} />
              <span>{user?.role === 'user' ? 'My Tasks' : 'Tasks'}</span>
            </Link>

            {canAccessUsers && (
              <>
                <Link 
                  to="/reports" 
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/reports') 
                      ? 'text-primary-600 bg-primary-50 shadow-sm' 
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <FileText size={18} />
                  <span>Reports</span>
                </Link>

                <Link 
                  to="/activities" 
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/activities') 
                      ? 'text-primary-600 bg-primary-50 shadow-sm' 
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <Activity size={18} />
                  <span>Activities</span>
                </Link>

                {user?.role === 'admin' && (
                  <Link 
                    to="/settings" 
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive('/settings') 
                        ? 'text-primary-600 bg-primary-50 shadow-sm' 
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    <Settings size={18} />
                    <span>Settings</span>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center space-x-3">
            <Link
              to="/profile"
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-all duration-200"
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-secondary-100 to-primary-100 rounded-full flex items-center justify-center border-2 border-primary-200">
                  <User size={16} className="text-primary-600" />
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
                </div>
              </div>
            </Link>
            
            <div className="h-6 w-px bg-gray-300"></div>
            
            <button 
              onClick={logout}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar