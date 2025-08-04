import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

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
  resendConfirmationEmail: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
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
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from database
  const fetchUserProfile = async (supabaseUser: SupabaseUser): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        // If profile doesn't exist yet (PGRST116 = no rows returned)
        if (error.code === 'PGRST116') {
          console.log('Profile not found, waiting for trigger to create it...');
          return null; // Return null to indicate profile doesn't exist yet
        }
        // Handle 406 Not Acceptable error (RLS policy violation)
        if (error.code === '406') {
          console.log('RLS policy violation, profile might not exist yet or user not authenticated...');
          return null;
        }
        console.error('Error fetching user profile:', error);
        return null;
      }

      return {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Create user profile in database (fallback method)
  const createUserProfile = async (supabaseUser: SupabaseUser, name: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: supabaseUser.id,
          email: supabaseUser.email!,
          name: name,
          role: 'user'
        })
        .select()
        .single();

      if (error) {
        // If profile already exists (created by trigger), try to fetch it
        if (error.code === '23505') { // Unique violation
          console.log('Profile already exists, fetching...');
          return await fetchUserProfile(supabaseUser);
        }
        console.error('Error creating user profile:', error);
        return null;
      }

      return {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role
      };
    } catch (error) {
      console.error('Error creating user profile:', error);
      return null;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        return false;
      }

      if (data.user) {
        // For registration, we need to wait for the session to be established
        // and for the database trigger to create the profile
        // Return true immediately and let the auth state change handler deal with profile fetching
        console.log('Registration successful, waiting for session establishment...');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        // Throw the error so the SignInPage can handle it properly
        throw error;
      }

      if (data.user) {
        // Fetch user profile from database
        const userProfile = await fetchUserProfile(data.user);
        if (userProfile) {
          setUser(userProfile);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      // Re-throw the error so the SignInPage can handle it
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resendConfirmationEmail = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });

      if (error) {
        console.error('Error resending confirmation email:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error resending confirmation email:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true);
        setSession(session);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // For new registrations, the profile might not be immediately available
          // Use retry mechanism with longer delays for registration
          let userProfile: User | null = null;
          let attempts = 0;
          const maxAttempts = 10; // More attempts for registration
          
          while (!userProfile && attempts < maxAttempts) {
            if (attempts > 0) {
              // Longer delays for registration: 500ms, 1000ms, 1500ms, etc.
              await new Promise(resolve => setTimeout(resolve, 500 + (attempts - 1) * 500));
            }
            
            userProfile = await fetchUserProfile(session.user);
            attempts++;
            
            if (!userProfile && attempts < maxAttempts) {
              console.log(`Profile not found, attempt ${attempts}/${maxAttempts}, retrying...`);
            }
          }
          
          if (userProfile) {
            console.log('Profile successfully fetched:', userProfile);
            setUser(userProfile);
          } else {
            console.error('Failed to fetch user profile after all attempts');
            setUser(null);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session?.user) {
        // For existing sessions, profile should already exist
        const userProfile = await fetchUserProfile(session.user);
        setUser(userProfile);
      }
      setLoading(false);
    };

    getInitialSession();

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    login,
    register,
    resendConfirmationEmail,
    logout,
    isAuthenticated: !!session?.user,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};