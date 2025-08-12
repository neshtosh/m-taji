import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Enable persistent sessions across browser tabs
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'm-taji-auth-token',
    // Auto refresh tokens before they expire
    autoRefreshToken: true,
    // Persist session across browser tabs
    persistSession: true,
    // Detect session in URL (for magic links, etc.)
    detectSessionInUrl: true,
    // Flow type for authentication
    flowType: 'pkce'
  },
  // Enable real-time subscriptions
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  // Global error handling
  global: {
    headers: {
      'X-Client-Info': 'm-taji-web'
    }
  }
})

// Add error logging for debugging
if (import.meta.env.DEV) {
  // Log auth state changes
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('Supabase Auth State Change:', {
      event,
      userId: session?.user?.id,
      timestamp: new Date().toISOString()
    });
  });
}

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