import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase, restoreSession, validateAndRefreshSession } from '../lib/supabase';

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
  refreshSession: () => Promise<void>;
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

  // Create broadcast channel for cross-tab communication
  const authChannel = typeof BroadcastChannel !== 'undefined' 
    ? new BroadcastChannel('auth-sync') 
    : null;

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

  const refreshSession = async (): Promise<void> => {
    try {
      setLoading(true);
      const newSession = await restoreSession();
      setSession(newSession);
      if (newSession?.user) {
        const userProfile = await fetchUserProfile(newSession.user);
        setUser(userProfile);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true);
        setSession(session);
        
        // Broadcast auth state change to other tabs
        if (authChannel) {
          authChannel.postMessage({
            type: 'AUTH_STATE_CHANGE',
            event,
            session: session ? { 
              access_token: session.access_token,
              refresh_token: session.refresh_token,
              expires_at: session.expires_at,
              user: session.user ? {
                id: session.user.id,
                email: session.user.email
              } : null
            } : null
          });
        }
        
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

    // Listen for auth state changes from other tabs
    const handleAuthMessage = async (event: MessageEvent) => {
      if (event.data.type === 'AUTH_STATE_CHANGE') {
        console.log('Received auth state change from another tab:', event.data.event);
        
        if (event.data.event === 'SIGNED_IN' && event.data.session?.user) {
          // Refresh session and user profile
          const session = await restoreSession();
          setSession(session);
          if (session?.user) {
            const userProfile = await fetchUserProfile(session.user);
            setUser(userProfile);
          }
        } else if (event.data.event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
        }
      }
    };

    if (authChannel) {
      authChannel.addEventListener('message', handleAuthMessage);
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        // Use the utility function for better session restoration
        const session = await restoreSession();
        setSession(session);
        if (session?.user) {
          // For existing sessions, profile should already exist
          // But add retry mechanism in case of temporary issues
          let userProfile: User | null = null;
          let attempts = 0;
          const maxAttempts = 3;
          
          while (!userProfile && attempts < maxAttempts) {
            if (attempts > 0) {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
            
            userProfile = await fetchUserProfile(session.user);
            attempts++;
            
            if (!userProfile && attempts < maxAttempts) {
              console.log(`Profile not found on attempt ${attempts}/${maxAttempts}, retrying...`);
            }
          }
          
          setUser(userProfile);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    // Validate and refresh session periodically
    const validateSession = async () => {
      try {
        const newSession = await validateAndRefreshSession();
        if (newSession && newSession !== session) {
          setSession(newSession);
        }
      } catch (error) {
        console.error('Error validating session:', error);
      }
    };

    getInitialSession();

    // Set up periodic session validation (every 5 minutes)
    const validationInterval = setInterval(validateSession, 5 * 60 * 1000);

    // Listen for storage changes to sync auth state across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.includes('supabase')) {
        // Refresh session when storage changes
        getInitialSession();
      }
    };

    // Also listen for focus events to refresh session when tab becomes active
    const handleFocus = () => {
      getInitialSession();
      validateSession();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      subscription.unsubscribe();
      clearInterval(validationInterval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
      if (authChannel) {
        authChannel.removeEventListener('message', handleAuthMessage);
        authChannel.close();
      }
    };
  }, []);

  const value = {
    user,
    login,
    register,
    resendConfirmationEmail,
    logout,
    isAuthenticated: !!session?.user,
    loading,
    refreshSession
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};