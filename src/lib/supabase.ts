import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

// Utility function to parse cookies
const parseCookies = () => {
  return document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    if (key && value) {
      acc[key] = decodeURIComponent(value);
    }
    return acc;
  }, {} as Record<string, string>);
};

// Utility function to set a cookie
const setCookie = (key: string, value: string, options: string[] = []) => {
  const cookieOptions = [
    'path=/',
    'SameSite=Lax',
    ...options
  ].join('; ');
  
  document.cookie = `${key}=${encodeURIComponent(value)}; ${cookieOptions}`;
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storage: {
      getItem: (key) => {
        // Try to get from cookies first, then localStorage as fallback
        const cookies = parseCookies();
        
        if (cookies[key]) {
          return cookies[key];
        }
        
        // Fallback to localStorage
        return localStorage.getItem(key);
      },
      setItem: (key, value) => {
        // Store in both cookies and localStorage for redundancy
        const cookieOptions = [
          'Max-Age=604800' // 7 days
        ];
        
        // Only add Secure flag if we're on HTTPS
        if (window.location.protocol === 'https:') {
          cookieOptions.push('Secure');
        }
        
        setCookie(key, value, cookieOptions);
        localStorage.setItem(key, value);
      },
      removeItem: (key) => {
        // Remove from both cookies and localStorage
        document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        localStorage.removeItem(key);
      }
    }
  }
})

// Utility function to restore session from storage
export const restoreSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error restoring session:', error);
      return null;
    }
    
    // Check if session is expired
    if (session && session.expires_at) {
      const expiresAt = new Date(session.expires_at * 1000);
      const now = new Date();
      
      if (expiresAt <= now) {
        console.log('Session expired, attempting to refresh...');
        const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          console.error('Error refreshing session:', refreshError);
          return null;
        }
        return refreshedSession;
      }
    }
    
    return session;
  } catch (error) {
    console.error('Error restoring session:', error);
    return null;
  }
};

// Utility function to validate session and refresh if needed
export const validateAndRefreshSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error);
      return null;
    }
    
    if (!session) {
      return null;
    }
    
    // Check if session is about to expire (within 5 minutes)
    if (session.expires_at) {
      const expiresAt = new Date(session.expires_at * 1000);
      const now = new Date();
      const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);
      
      if (expiresAt <= fiveMinutesFromNow) {
        console.log('Session expiring soon, refreshing...');
        const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          console.error('Error refreshing session:', refreshError);
          return session; // Return original session if refresh fails
        }
        return refreshedSession;
      }
    }
    
    return session;
  } catch (error) {
    console.error('Error validating session:', error);
    return null;
  }
};

// Database types for better TypeScript support
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'user'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role?: 'admin' | 'user'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'user'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 