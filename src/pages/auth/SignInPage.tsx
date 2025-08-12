import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/ui/Logo';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, resendConfirmationEmail } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password. Please check your credentials and try again.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Handle specific Supabase error messages
      if (err?.message?.includes('Invalid login credentials') || err?.message?.includes('Invalid email or password')) {
        setError('Invalid email or password. Please check your credentials and try again.');
      } else if (err?.message?.includes('Email not confirmed')) {
        setError('Please check your email and confirm your account before signing in. If you haven\'t received a confirmation email, please check your spam folder.');
      } else if (err?.message?.includes('Too many requests')) {
        setError('Too many login attempts. Please wait a moment before trying again.');
      } else if (err?.message?.includes('User not found')) {
        setError('No account found with this email address. Please check your email or sign up for a new account.');
      } else if (err?.message?.includes('Invalid email')) {
        setError('Please enter a valid email address.');
      } else {
        setError('Login failed. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <Logo size="md" />
          </div>
          <h1 className="text-2xl font-bold text-text-dark arboria-font mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to your M-taji account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
            >
              <div className="flex flex-col space-y-2">
                <span>{error}</span>
                {error.includes('Email not confirmed') && (
                  <div className="text-sm">
                    <span className="text-gray-600">Need to resend confirmation email? </span>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await resendConfirmationEmail(email);
                          setError('Confirmation email sent! Please check your inbox and spam folder.');
                        } catch (err: any) {
                          if (err?.message?.includes('User not found')) {
                            setError('No account found with this email address. Please sign up first.');
                          } else {
                            setError('Failed to resend confirmation email. Please try again later.');
                          }
                        }
                      }}
                      className="text-primary hover:text-primary-dark font-medium underline"
                    >
                      Click here
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-dark mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-dark mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <div className="mt-2 text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:text-primary-dark font-medium"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:text-primary-dark font-medium">
              Sign up here
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-primary hover:text-primary-dark font-medium text-sm"
          >
            ← Back to Website
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SignInPage;