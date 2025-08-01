import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, User, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../ui/Logo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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
    { name: 'Changemakers', path: '/changemakers' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];



  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 pointer-events-auto ${
        isScrolled 
          ? 'bg-white shadow-lg backdrop-blur-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-auto">
        <div className="flex justify-between items-center h-16 pointer-events-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary p-2 rounded-lg">
              <Logo variant="white" size="md" />
            </div>
            <span className={`text-xl font-bold arboria-font ${
              isScrolled ? 'text-text-dark' : 'text-white'
            }`}>
              M-taji
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`font-medium transition-colors duration-200 cursor-pointer ${
                  location.pathname === item.path
                    ? (isScrolled ? 'text-primary' : 'text-white font-bold')
                    : (isScrolled ? 'text-text-dark hover:text-primary' : 'text-white hover:text-primary-light')
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Authentication Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className={`text-sm ${isScrolled ? 'text-text-dark' : 'text-white'}`}>
                  Welcome, {user?.name}
                </span>
                <button
                  onClick={logout}
                  className="text-sm font-medium text-text-dark hover:text-primary transition-colors"
                >
                  Sign Out
                </button>
                <button className="btn-primary">
                  Donate Now
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/signin"
                  className={`flex items-center space-x-1 font-medium transition-colors duration-200 ${
                    isScrolled ? 'text-text-dark hover:text-primary' : 'text-white hover:text-primary-light'
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/signup"
                  className={`flex items-center space-x-1 px-4 py-2 rounded-lg border transition-colors ${
                    isScrolled 
                      ? 'border-primary text-primary hover:bg-primary hover:text-white' 
                      : 'border-white text-white hover:bg-white hover:text-primary'
                  }`}
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Sign Up</span>
                </Link>
                <button className="btn-primary">
                  Donate Now
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md ${
                isScrolled ? 'text-text-dark' : 'text-white'
              }`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{ height: isOpen ? 'auto' : 0 }}
          className="md:hidden overflow-hidden bg-white shadow-lg rounded-b-lg"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-primary bg-primary-light/10'
                    : 'text-text-dark hover:text-primary hover:bg-primary-light/5'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Authentication */}
            {isAuthenticated ? (
              <div className="mt-4 space-y-2">
                <div className="px-3 py-2 text-sm text-text-dark">
                  Welcome, {user?.name}
                </div>
                <button
                  onClick={logout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-text-dark hover:text-primary hover:bg-primary-light/5"
                >
                  Sign Out
                </button>
                <button className="w-full mt-4 btn-primary">
                  Donate Now
                </button>
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                <Link
                  to="/signin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-text-dark hover:text-primary hover:bg-primary-light/5"
                >
                  <User className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-text-dark hover:text-primary hover:bg-primary-light/5"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Sign Up</span>
                </Link>
                <button className="w-full mt-4 btn-primary">
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