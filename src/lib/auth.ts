import { supabase } from './supabase';
import { Session } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

// Session management utilities
export const authUtils = {
  // Check if session is valid and not expired
  isSessionValid: (session: Session | null): boolean => {
    if (!session) return false;
    
    const now = Math.floor(Date.now() / 1000);
    const expiresAt = session.expires_at;
    
    // Session is valid if it hasn't expired yet (with 5 minute buffer)
    return expiresAt ? expiresAt > now + 300 : false;
  },

  // Get session from localStorage (for debugging)
  getStoredSession: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('m-taji-auth-token');
  },

  // Clear stored session (for debugging)
  clearStoredSession: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('m-taji-auth-token');
  },

  // Force refresh session from server
  refreshSession: async (): Promise<Session | null> => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Error refreshing session:', error);
        return null;
      }
      return data.session;
    } catch (error) {
      console.error('Error refreshing session:', error);
      return null;
    }
  },

  // Check if we're in a browser environment
  isBrowser: (): boolean => {
    return typeof window !== 'undefined';
  },

  // Get session info for debugging
  getSessionInfo: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const stored = authUtils.getStoredSession();
    
    return {
      session: session ? {
        userId: session.user.id,
        expiresAt: session.expires_at,
        isValid: authUtils.isSessionValid(session)
      } : null,
      stored: stored ? 'exists' : 'not found',
      timestamp: new Date().toISOString()
    };
  }
};

// User profile persistence utilities
export const userProfileUtils = {
  // Storage key for user profile
  STORAGE_KEY: 'm-taji-user-profile',
  
  // Cache duration in milliseconds (24 hours)
  CACHE_DURATION: 24 * 60 * 60 * 1000,

  // Store user profile in localStorage
  storeUserProfile: (user: User): void => {
    if (typeof window === 'undefined') return;
    
    const profileData = {
      user,
      timestamp: Date.now(),
      version: '1.0' // For future cache invalidation
    };
    
    try {
      localStorage.setItem(userProfileUtils.STORAGE_KEY, JSON.stringify(profileData));
      console.log('User profile stored in localStorage:', user.id);
    } catch (error) {
      console.error('Error storing user profile:', error);
    }
  },

  // Get user profile from localStorage
  getStoredUserProfile: (): User | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = localStorage.getItem(userProfileUtils.STORAGE_KEY);
      if (!stored) return null;
      
      const profileData = JSON.parse(stored);
      
      // Check if cache is still valid
      const now = Date.now();
      const isExpired = now - profileData.timestamp > userProfileUtils.CACHE_DURATION;
      
      if (isExpired) {
        console.log('User profile cache expired, clearing...');
        userProfileUtils.clearUserProfile();
        return null;
      }
      
      console.log('User profile retrieved from cache:', profileData.user.id);
      return profileData.user;
    } catch (error) {
      console.error('Error retrieving user profile from cache:', error);
      userProfileUtils.clearUserProfile();
      return null;
    }
  },

  // Clear user profile from localStorage
  clearUserProfile: (): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(userProfileUtils.STORAGE_KEY);
      console.log('User profile cleared from localStorage');
    } catch (error) {
      console.error('Error clearing user profile:', error);
    }
  },

  // Check if user profile exists in cache
  hasStoredUserProfile: (): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      const stored = localStorage.getItem(userProfileUtils.STORAGE_KEY);
      if (!stored) return false;
      
      const profileData = JSON.parse(stored);
      const now = Date.now();
      const isExpired = now - profileData.timestamp > userProfileUtils.CACHE_DURATION;
      
      return !isExpired;
    } catch (error) {
      return false;
    }
  },

  // Update user profile in cache
  updateUserProfile: (updates: Partial<User>): void => {
    if (typeof window === 'undefined') return;
    
    const currentProfile = userProfileUtils.getStoredUserProfile();
    if (!currentProfile) return;
    
    const updatedProfile = { ...currentProfile, ...updates };
    userProfileUtils.storeUserProfile(updatedProfile);
  },

  // Invalidate user profile cache (force refresh on next access)
  invalidateUserProfile: (): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(userProfileUtils.STORAGE_KEY);
      console.log('User profile cache invalidated');
    } catch (error) {
      console.error('Error invalidating user profile cache:', error);
    }
  },

  // Get cache info for debugging
  getCacheInfo: () => {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = localStorage.getItem(userProfileUtils.STORAGE_KEY);
      if (!stored) return { exists: false };
      
      const profileData = JSON.parse(stored);
      const now = Date.now();
      const age = now - profileData.timestamp;
      const isExpired = age > userProfileUtils.CACHE_DURATION;
      
      return {
        exists: true,
        userId: profileData.user.id,
        age: Math.round(age / 1000 / 60), // Age in minutes
        isExpired,
        version: profileData.version
      };
    } catch (error) {
      return { exists: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
};

// Cross-tab synchronization utilities
export const tabSync = {
  // Broadcast auth state change to other tabs
  broadcastAuthChange: (event: string, session: Session | null) => {
    if (!authUtils.isBrowser()) return;
    
    const message = {
      type: 'AUTH_STATE_CHANGE',
      event,
      session: session ? {
        userId: session.user.id,
        expiresAt: session.expires_at
      } : null,
      timestamp: Date.now()
    };
    
    // Use BroadcastChannel if available (modern browsers)
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('m-taji-auth');
      channel.postMessage(message);
    }
    
    // Fallback to localStorage event
    localStorage.setItem('m-taji-auth-sync', JSON.stringify(message));
    localStorage.removeItem('m-taji-auth-sync');
  },

  // Listen for auth state changes from other tabs
  listenForAuthChanges: (callback: (event: string, session: Session | null) => void) => {
    if (!authUtils.isBrowser()) return () => {};

    let cleanup: (() => void) | undefined;

    // Use BroadcastChannel if available
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('m-taji-auth');
      
      const handleMessage = (event: MessageEvent) => {
        if (event.data.type === 'AUTH_STATE_CHANGE') {
          callback(event.data.event, event.data.session);
        }
      };
      
      channel.addEventListener('message', handleMessage);
      cleanup = () => channel.close();
    } else {
      // Fallback to storage event
      const handleStorage = (e: StorageEvent) => {
        if (e.key === 'm-taji-auth-sync' && e.newValue) {
          try {
            const data = JSON.parse(e.newValue);
            if (data.type === 'AUTH_STATE_CHANGE') {
              callback(data.event, data.session);
            }
          } catch (error) {
            console.error('Error parsing auth sync message:', error);
          }
        }
      };
      
      window.addEventListener('storage', handleStorage);
      cleanup = () => window.removeEventListener('storage', handleStorage);
    }

    return cleanup || (() => {});
  }
};

export default authUtils; 