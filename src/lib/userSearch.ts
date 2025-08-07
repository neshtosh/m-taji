import { supabase } from './supabase';

export interface PublicUserProfile {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  // Optional fields that might exist in some databases
  bio?: string;
  location?: string;
  website?: string;
  social_links?: any;
  avatar_url?: string;
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
    console.log('Fetching all public users...');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, created_at, updated_at, bio, location, website, avatar_url')
      .order('created_at', { ascending: false });

    console.log('All users found:', data);
    console.log('Fetch error:', error);

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
    console.log('Searching for users with query:', query);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, created_at, updated_at, bio, location, website, avatar_url')
      .or(`name.ilike.%${query}%,bio.ilike.%${query}%,location.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    console.log('Search results:', data);
    console.log('Search error:', error);

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
      .select('id, name, email, created_at, updated_at, bio, location, website, avatar_url')
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
    const [projects, blogs, microblogs, followers] = await Promise.all([
      supabase.from('user_projects').select('id').eq('user_id', userId),
      supabase.from('blog_posts').select('id').eq('author_id', userId).eq('is_published', true),
      supabase.from('microblog_posts').select('id').eq('author_id', userId).eq('is_published', true),
      supabase.from('followers').select('id').eq('following_id', userId)
    ]);

    const stats = {
      projects: projects.data?.length || 0,
      blogs: blogs.data?.length || 0,
      microblogs: microblogs.data?.length || 0,
      followers: followers.data?.length || 0
    };

    return stats;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return { projects: 0, blogs: 0, microblogs: 0, followers: 0 };
  }
}; 

// Test function to check database contents
export const testDatabaseConnection = async () => {
  try {
    // Test 1: Check if we can access profiles table at all
    const { data: allData, error: allError } = await supabase
      .from('profiles')
      .select('*');
    
    // Test 2: Check table structure
    const { data: structureData, error: structureError } = await supabase
      .from('profiles')
      .select('id, name, email')
      .limit(1);
    
    // Test 3: Check user_projects table
    const { data: projectsData, error: projectsError } = await supabase
      .from('user_projects')
      .select('id, user_id, title')
      .limit(5);
    
    // Test 4: Check blog_posts table
    const { data: blogsData, error: blogsError } = await supabase
      .from('blog_posts')
      .select('id, author_id, title, is_published')
      .limit(5);
    
    // Test 5: Check microblog_posts table
    const { data: microblogsData, error: microblogsError } = await supabase
      .from('microblog_posts')
      .select('id, author_id, title, is_published')
      .limit(5);
    
    return { 
      allData, 
      structureData, 
      projectsData, 
      blogsData, 
      microblogsData,
      errors: { allError, structureError, projectsError, blogsError, microblogsError }
    };
  } catch (error) {
    console.error('Database test error:', error);
    return null;
  }
}; 