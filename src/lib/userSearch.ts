import { supabase } from './supabase';
import { cache, CACHE_KEYS } from './cache';

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

// Fetch all public user profiles with optimized batch queries and caching
export const fetchAllPublicUsers = async (): Promise<PublicUserProfile[]> => {
  try {
    // Check cache first
    const cachedData = cache.get(CACHE_KEYS.ALL_USERS);
    if (cachedData) {
      console.log('Using cached users data');
      return cachedData;
    }

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

    const users = data || [];
    
    // Cache the results for 2 minutes
    cache.set(CACHE_KEYS.ALL_USERS, users, 2 * 60 * 1000);
    
    return users;
  } catch (error) {
    console.error('Error fetching public users:', error);
    return [];
  }
};

// Optimized function to fetch all user stats in batch with caching
export const fetchAllUserStats = async (userIds: string[]) => {
  try {
    if (userIds.length === 0) return {};

    // Create cache key based on user IDs
    const cacheKey = `${CACHE_KEYS.USER_STATS}_${userIds.sort().join('_')}`;
    
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log('Using cached user stats');
      return cachedData;
    }

    // Batch query for projects
    const { data: projectsData } = await supabase
      .from('user_projects')
      .select('user_id, id')
      .in('user_id', userIds);

    // Batch query for blog posts
    const { data: blogsData } = await supabase
      .from('blog_posts')
      .select('author_id, id')
      .in('author_id', userIds)
      .eq('is_published', true);

    // Batch query for microblog posts
    const { data: microblogsData } = await supabase
      .from('microblog_posts')
      .select('author_id, id')
      .in('author_id', userIds);

    // Batch query for followers
    const { data: followersData } = await supabase
      .from('followers')
      .select('following_id, follower_id')
      .in('following_id', userIds);

    // Process the data
    const stats: { [key: string]: any } = {};
    
    userIds.forEach(userId => {
      const projects = projectsData?.filter(p => p.user_id === userId) || [];
      const blogs = blogsData?.filter(b => b.author_id === userId) || [];
      const microblogs = microblogsData?.filter(m => m.author_id === userId) || [];
      const followers = followersData?.filter(f => f.following_id === userId) || [];

      stats[userId] = {
        projects: projects.length,
        blogs: blogs.length,
        microblogs: microblogs.length,
        followers: followers.length
      };
    });

    // Cache the results for 1 minute
    cache.set(cacheKey, stats, 60 * 1000);
    
    return stats;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return {};
  }
};

// Optimized function to fetch all follow stats in batch
export const fetchAllFollowStats = async (userIds: string[], currentUserId?: string) => {
  try {
    if (userIds.length === 0) return {};

    // Batch query for followers count
    const { data: followersData } = await supabase
      .from('followers')
      .select('following_id, follower_id')
      .in('following_id', userIds);

    // Batch query for following count
    const { data: followingData } = await supabase
      .from('followers')
      .select('follower_id, following_id')
      .in('follower_id', userIds);

    // Batch query for current user's following status
    let currentUserFollowing: any[] = [];
    if (currentUserId) {
      const { data } = await supabase
        .from('followers')
        .select('following_id')
        .eq('follower_id', currentUserId)
        .in('following_id', userIds);
      currentUserFollowing = data || [];
    }

    // Process the data
    const followStats: { [key: string]: any } = {};
    
    userIds.forEach(userId => {
      const followers = followersData?.filter(f => f.following_id === userId) || [];
      const following = followingData?.filter(f => f.follower_id === userId) || [];
      const isFollowing = currentUserFollowing.some(f => f.following_id === userId);

      followStats[userId] = {
        followers_count: followers.length,
        following_count: following.length,
        is_following: isFollowing
      };
    });

    return followStats;
  } catch (error) {
    console.error('Error fetching follow stats:', error);
    return {};
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

// Get user's stats (projects, blogs, etc.) - keeping for backward compatibility
export const fetchUserStats = async (userId: string) => {
  try {
    const [projects, blogs, microblogs, followers] = await Promise.all([
      supabase.from('user_projects').select('id').eq('user_id', userId),
      supabase.from('blog_posts').select('id').eq('author_id', userId).eq('is_published', true),
      supabase.from('microblog_posts').select('id').eq('author_id', userId),
      supabase.from('followers').select('id').eq('following_id', userId)
    ]);

    return {
      projects: projects.data?.length || 0,
      blogs: blogs.data?.length || 0,
      microblogs: microblogs.data?.length || 0,
      followers: followers.data?.length || 0
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return {
      projects: 0,
      blogs: 0,
      microblogs: 0,
      followers: 0
    };
  }
};

// Test database connection
export const testDatabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Database connection test failed:', error);
      return false;
    }

    console.log('Database connection test successful');
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
}; 