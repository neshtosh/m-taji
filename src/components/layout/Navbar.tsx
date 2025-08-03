import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, User, UserPlus, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../ui/Logo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Youth Leaders', path: '/changemakers' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleUserMenuToggle = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 pointer-events-auto ${
        isScrolled 
          ? 'bg-gray-900 shadow-lg backdrop-blur-sm' 
          : 'bg-gray-900/95'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-auto">
        <div className="flex justify-between items-center h-16 pointer-events-auto">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 relative z-10 pointer-events-auto"
          >
            <div className="bg-primary p-2 rounded-lg">
              <Logo variant="white" size="md" />
            </div>
            <span className="text-xl font-bold text-white arboria-font">
              M-taji
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 pointer-events-auto">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`font-medium transition-colors duration-200 cursor-pointer relative z-10 pointer-events-auto ${
                  location.pathname === item.path
                    ? 'text-amber-400 font-bold'
                    : 'text-gray-300 hover:text-amber-400'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Authentication Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4 relative z-10 pointer-events-auto">
                {/* User Profile Button */}
                <div className="relative">
                  <button
                    onClick={handleUserMenuToggle}
                    className="flex items-center space-x-2 text-gray-300 hover:text-amber-400 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="font-medium text-white">
                      Welcome, {user?.name}
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${showUserMenu ? 'rotate-180' : ''} text-white`} />
                  </button>
                  
                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-700">
                      <Link
                        to="/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                      >
                        Settings
                      </Link>
                      <hr className="my-1 border-gray-700" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
                <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Donate Now
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4 relative z-10 pointer-events-auto">
                <Link
                  to="/signin"
                  className="flex items-center space-x-1 font-medium transition-colors duration-200 text-gray-300 hover:text-amber-400"
                >
                  <User className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center space-x-1 px-4 py-2 rounded-lg border border-amber-600 text-amber-400 hover:bg-amber-600 hover:text-white transition-colors"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Sign Up</span>
                </Link>
                <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Donate Now
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden relative z-10 pointer-events-auto">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-white"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{ height: isOpen ? 'auto' : 0 }}
          className="md:hidden overflow-hidden bg-gray-800 shadow-lg rounded-b-lg relative z-40 pointer-events-auto"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors cursor-pointer pointer-events-auto ${
                  location.pathname === item.path
                    ? 'text-amber-400 bg-gray-700'
                    : 'text-gray-300 hover:text-amber-400 hover:bg-gray-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Authentication */}
            {isAuthenticated ? (
              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-3 px-3 py-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Welcome, {user?.name}</div>
                    <div className="text-xs text-gray-400">Youth Changemaker</div>
                  </div>
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-amber-400 hover:bg-gray-700"
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-amber-400 hover:bg-gray-700"
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-gray-700"
                >
                  Sign Out
                </button>
                <button className="w-full mt-4 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Donate Now
                </button>
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                <Link
                  to="/signin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-amber-400 hover:bg-gray-700"
                >
                  <User className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-amber-400 hover:bg-gray-700"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Sign Up</span>
                </Link>
                <button className="w-full mt-4 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Donate Now
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;