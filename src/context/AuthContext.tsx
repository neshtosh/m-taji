import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Get stored users from localStorage
  const getStoredUsers = (): { [key: string]: { password: string; name: string; role: 'admin' | 'user' } } => {
    const stored = localStorage.getItem('users');
    return stored ? JSON.parse(stored) : {};
  };

  // Store users in localStorage
  const storeUsers = (users: { [key: string]: { password: string; name: string; role: 'admin' | 'user' } }) => {
    localStorage.setItem('users', JSON.stringify(users));
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const users = getStoredUsers();
      
      // Check if user already exists
      if (users[email]) {
        return false; // User already exists
      }

      // Add new user
      users[email] = {
        password,
        name,
        role: 'user'
      };

      storeUsers(users);
      
      // Auto-login after successful registration
      const user: User = {
        id: Date.now().toString(),
        email,
        name,
        role: 'user'
      };
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Check for hardcoded admin credentials first
      if (email === 'admin@m-taji.org' && password === 'admin123') {
        const mockUser: User = {
          id: '1',
          email: 'admin@m-taji.org',
          name: 'Admin User',
          role: 'admin'
        };
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        return true;
      }

      // Check registered users
      const users = getStoredUsers();
      const userData = users[email];

      if (userData && userData.password === password) {
        const user: User = {
          id: Date.now().toString(), // Simple ID generation
          email,
          name: userData.name,
          role: userData.role
        };
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};