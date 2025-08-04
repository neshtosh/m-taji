import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User } from 'lucide-react';
import Logo from '../ui/Logo';

interface DashboardHeaderProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ activeTab = 'profile', onTabChange }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleTabClick = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const mainNavItems = [
    { id: 'changemakers', name: 'Youth Leaders', path: '/changemakers' },
    { id: 'projects', name: 'Projects', path: '/projects' }
  ];

  return (
    <header className="bg-white dark:bg-black shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
          >
            <div className="bg-primary p-2 rounded-lg">
              <Logo variant="white" size="md" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">M-TAJI</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">Youth Leaders Platform</p>
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {mainNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className="text-gray-700 dark:text-gray-300 hover:text-primary font-medium transition-colors"
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-800 text-white placeholder-gray-400"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Youth Changemaker</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
          </div>
        </div>


      </div>
    </header>
  );
};

export default DashboardHeader; 