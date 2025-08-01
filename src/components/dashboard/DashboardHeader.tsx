import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <header className="bg-white shadow-lg border-b-2 border-amber-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <h1 className="text-2xl font-bold text-amber-800">M-TAJI</h1>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-8">
            <button className="px-4 py-2 text-amber-800 font-semibold border-b-2 border-amber-600">
              Dashboard
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-amber-800 transition-colors">
              Gallery
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-amber-800 transition-colors">
              Microblog
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-amber-800 transition-colors">
              Settings
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-gray-600 hover:text-amber-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Profile Section */}
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">Youth Changemaker</p>
            </div>
            
            {/* Profile Thumbnail */}
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader; 