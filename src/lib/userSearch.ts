import { supabase } from './supabase';

export interface PublicUserProfile {
  id: string;
  name: string;
  email: string;
  bio?: string;
  location?: string;
  website?: string;
  social_links?: any;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  // Additional fields for display
  area?: string;
  impact?: string;
  followers?: number;
  projects?: number;
  fundsRaised?: string;
}

// Fetch all public user profiles
export const fetchAllPublicUsers = async (): Promise<PublicUserProfile[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, bio, location, website, social_links, avatar_url, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching public users:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching public users:', error);
    return [];
  }
};

// Search users by name, location, or bio
export const searchUsers = async (query: string): Promise<PublicUserProfile[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, bio, location, website, social_links, avatar_url, created_at, updated_at')
      .or(`name.ilike.%${query}%,location.ilike.%${query}%,bio.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching users:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
};

// Get user's public profile by ID
export const fetchPublicUserProfile = async (userId: string): Promise<PublicUserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, bio, location, website, social_links, avatar_url, created_at, updated_at')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching public user profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching public user profile:', error);
    return null;
  }
};

// Get user's stats (projects, blogs, etc.)
export const fetchUserStats = async (userId: string) => {
  try {
    const [projects, blogs, microblogs] = await Promise.all([
      supabase.from('user_projects').select('id').eq('author_id', userId),
      supabase.from('blog_posts').select('id').eq('author_id', userId).eq('is_published', true),
      supabase.from('microblog_posts').select('id').eq('author_id', userId).eq('is_published', true)
    ]);

    return {
      projects: projects.data?.length || 0,
      blogs: blogs.data?.length || 0,
      microblogs: microblogs.data?.length || 0
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return { projects: 0, blogs: 0, microblogs: 0 };
  }
}; 