import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { authUtils, tabSync, userProfileUtils } from '../lib/auth';

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

      const userProfile = {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role
      };

      // Store the profile in localStorage for future use
      userProfileUtils.storeUserProfile(userProfile);

      return userProfile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Get user profile with caching
  const getUserProfile = async (supabaseUser: SupabaseUser): Promise<User | null> => {
    // First, try to get from localStorage cache
    const cachedProfile = userProfileUtils.getStoredUserProfile();
    
    if (cachedProfile && cachedProfile.id === supabaseUser.id) {
      console.log('Using cached user profile:', cachedProfile.id);
      return cachedProfile;
    }

    // If not in cache or cache is invalid, fetch from database
    console.log('Fetching user profile from database:', supabaseUser.id);
    return await fetchUserProfile(supabaseUser);
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
          return await getUserProfile(supabaseUser);
        }
        console.error('Error creating user profile:', error);
        return null;
      }

      const userProfile = {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role
      };

      // Store the profile in localStorage
      userProfileUtils.storeUserProfile(userProfile);

      return userProfile;
    } catch (error) {
      console.error('Error creating user profile:', error);
      return null;
    }
  };

  // Handle session restoration and user profile fetching
  const handleSessionChange = async (session: Session | null, event: string) => {
    console.log('Auth state change:', event, session?.user?.id);
    setLoading(true);
    setSession(session);
    
    // Broadcast the auth change to other tabs
    tabSync.broadcastAuthChange(event, session);
    
    if (session?.user) {
      try {
        // Check if session is valid
        if (!authUtils.isSessionValid(session)) {
          console.log('Session is invalid or expired, attempting to refresh...');
          const refreshedSession = await authUtils.refreshSession();
          if (refreshedSession) {
            setSession(refreshedSession);
            session = refreshedSession;
          } else {
            console.log('Failed to refresh session, clearing auth state');
            setUser(null);
            userProfileUtils.clearUserProfile();
            setLoading(false);
            return;
          }
        }

        // Get user profile with caching
        let userProfile: User | null = null;
        let attempts = 0;
        const maxAttempts = event === 'SIGNED_IN' ? 10 : 3; // More attempts for new sign-ins
        
        while (!userProfile && attempts < maxAttempts) {
          if (attempts > 0) {
            // Progressive delay: 500ms, 1000ms, 1500ms, etc.
            const delay = event === 'SIGNED_IN' ? 500 + (attempts - 1) * 500 : 1000 * attempts;
            await new Promise(resolve => setTimeout(resolve, delay));
          }
          
          userProfile = await getUserProfile(session.user);
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
          userProfileUtils.clearUserProfile();
        }
      } catch (error) {
        console.error('Error handling session change:', error);
        setUser(null);
        userProfileUtils.clearUserProfile();
      }
    } else {
      // No session, clear user and cache
      setUser(null);
      userProfileUtils.clearUserProfile();
    }
    
    setLoading(false);
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
        // Get user profile with caching
        const userProfile = await getUserProfile(data.user);
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
      userProfileUtils.clearUserProfile();
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        await handleSessionChange(session, event);
      }
    );

    // Get initial session - this will trigger INITIAL_SESSION event if session exists
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Initial session check:', session?.user?.id);
        
        if (session) {
          // Handle initial session restoration
          await handleSessionChange(session, 'INITIAL_SESSION');
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        setLoading(false);
      }
    };

    getInitialSession();

    return () => subscription.unsubscribe();
  }, []);

  // Listen for cross-tab auth state changes
  useEffect(() => {
    const cleanup = tabSync.listenForAuthChanges(async (event, sessionData) => {
      console.log('Received auth change from another tab:', event);
      
      // Only handle if we don't have a session or if the session is different
      if (!session || (sessionData && session.user.id !== sessionData.user?.id)) {
        // Get the current session from Supabase
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession) {
          await handleSessionChange(currentSession, 'TAB_SYNC');
        }
      }
    });

    return cleanup;
  }, [session]);

  // Listen for storage events to sync auth state across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'm-taji-auth-token' && e.newValue !== e.oldValue) {
        console.log('Auth token changed in another tab, refreshing session...');
        // Refresh the session to sync with other tabs
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session !== null) {
            handleSessionChange(session, 'STORAGE_SYNC');
          }
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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

  // Debug logging for development
  if (import.meta.env.DEV) {
    console.log('AuthContext state:', {
      user: user?.id,
      session: session?.user?.id,
      isAuthenticated: !!session?.user,
      loading,
      sessionValid: session ? authUtils.isSessionValid(session) : false,
      cacheInfo: userProfileUtils.getCacheInfo()
    });
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};