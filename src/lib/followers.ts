import { supabase } from './supabase';

export interface FollowRelationship {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface UserFollowStats {
  followers_count: number;
  following_count: number;
  is_following: boolean;
}

// Create followers table if it doesn't exist
export const ensureFollowersTable = async () => {
  try {
    // Test if the table exists by trying to query it
    const { data, error } = await supabase
      .from('followers')
      .select('id')
      .limit(1);

    if (error && error.code === '42P01') {
      // Table doesn't exist, we'll need to create it manually
      console.log('Followers table does not exist. Please run the migration manually.');
      console.log('You can run this SQL in your Supabase dashboard:');
      console.log(`
        CREATE TABLE IF NOT EXISTS public.followers (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(follower_id, following_id)
        );
        
        ALTER TABLE public.followers ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Users can view all follower relationships" ON public.followers
          FOR SELECT USING (true);
        
        CREATE POLICY "Users can manage own follow relationships" ON public.followers
          FOR ALL USING (auth.uid() = follower_id);
      `);
      return false;
    }

    console.log('Followers table exists and is accessible');
    return true;
  } catch (error) {
    console.log('Error checking followers table:', error);
    return false;
  }
};

// Follow a user
export const followUser = async (followerId: string, followingId: string): Promise<boolean> => {
  try {
    // Ensure table exists
    await ensureFollowersTable();
    
    // Prevent self-following
    if (followerId === followingId) {
      throw new Error('Users cannot follow themselves');
    }

    const { error } = await supabase
      .from('followers')
      .insert({
        follower_id: followerId,
        following_id: followingId
      });

    if (error) {
      console.error('Error following user:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error following user:', error);
    return false;
  }
};

// Unfollow a user
export const unfollowUser = async (followerId: string, followingId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('followers')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId);

    if (error) {
      console.error('Error unfollowing user:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return false;
  }
};

// Get user's follow statistics
export const getUserFollowStats = async (userId: string, currentUserId?: string): Promise<UserFollowStats> => {
  try {
    console.log(`Getting follow stats for user: ${userId}, current user: ${currentUserId}`);
    
    // Get follower count
    const { data: followersData, error: followersError } = await supabase
      .from('followers')
      .select('id')
      .eq('following_id', userId);

    console.log('Followers query result:', { data: followersData, error: followersError });

    if (followersError) {
      console.error('Error fetching followers:', followersError);
    }

    // Get following count
    const { data: followingData, error: followingError } = await supabase
      .from('followers')
      .select('id')
      .eq('follower_id', userId);

    console.log('Following query result:', { data: followingData, error: followingError });

    if (followingError) {
      console.error('Error fetching following:', followingError);
    }

    // Check if current user is following this user
    let isFollowing = false;
    if (currentUserId && currentUserId !== userId) {
      const { data: followCheck, error: followCheckError } = await supabase
        .from('followers')
        .select('id')
        .eq('follower_id', currentUserId)
        .eq('following_id', userId)
        .single();

      console.log('Follow check result:', { data: followCheck, error: followCheckError });

      if (!followCheckError && followCheck) {
        isFollowing = true;
      }
    }

    const result = {
      followers_count: followersData?.length || 0,
      following_count: followingData?.length || 0,
      is_following: isFollowing
    };

    console.log('Final follow stats result:', result);
    return result;
  } catch (error) {
    console.error('Error getting user follow stats:', error);
    return {
      followers_count: 0,
      following_count: 0,
      is_following: false
    };
  }
};

// Get list of users that a user is following
export const getFollowingList = async (userId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('followers')
      .select(`
        following_id,
        profiles!followers_following_id_fkey (
          id,
          name,
          email,
          avatar_url,
          bio,
          location
        )
      `)
      .eq('follower_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching following list:', error);
      return [];
    }

    return data?.map(item => item.profiles) || [];
  } catch (error) {
    console.error('Error getting following list:', error);
    return [];
  }
};

// Get list of users following a user
export const getFollowersList = async (userId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('followers')
      .select(`
        follower_id,
        profiles!followers_follower_id_fkey (
          id,
          name,
          email,
          avatar_url,
          bio,
          location
        )
      `)
      .eq('following_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching followers list:', error);
      return [];
    }

    return data?.map(item => item.profiles) || [];
  } catch (error) {
    console.error('Error getting followers list:', error);
    return [];
  }
};

// Toggle follow status
export const toggleFollow = async (followerId: string, followingId: string): Promise<{ success: boolean; isFollowing: boolean }> => {
  try {
    // Check if already following
    const { data: existingFollow, error: checkError } = await supabase
      .from('followers')
      .select('id')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking follow status:', checkError);
      return { success: false, isFollowing: false };
    }

    if (existingFollow) {
      // Unfollow
      const success = await unfollowUser(followerId, followingId);
      return { success, isFollowing: false };
    } else {
      // Follow
      const success = await followUser(followerId, followingId);
      return { success, isFollowing: true };
    }
  } catch (error) {
    console.error('Error toggling follow:', error);
    return { success: false, isFollowing: false };
  }
};

// Test followers table structure and data
export const testFollowersTable = async () => {
  try {
    console.log('Testing followers table...');
    
    // Test 1: Check if table exists and is accessible
    const { data: allFollowers, error: allError } = await supabase
      .from('followers')
      .select('*');
    
    console.log('All followers data:', allFollowers);
    console.log('All followers error:', allError);
    
    // Test 2: Check table structure
    const { data: structureData, error: structureError } = await supabase
      .from('followers')
      .select('id, follower_id, following_id, created_at')
      .limit(1);
    
    console.log('Structure test data:', structureData);
    console.log('Structure test error:', structureError);
    
    // Test 3: Try to insert a test record (this will fail if table doesn't exist)
    const testFollowerId = 'test-follower-id';
    const testFollowingId = 'test-following-id';
    
    const { data: insertData, error: insertError } = await supabase
      .from('followers')
      .insert({
        follower_id: testFollowerId,
        following_id: testFollowingId
      })
      .select();
    
    console.log('Insert test data:', insertData);
    console.log('Insert test error:', insertError);
    
    // If insert succeeded, delete the test record
    if (insertData && insertData.length > 0) {
      const { error: deleteError } = await supabase
        .from('followers')
        .delete()
        .eq('follower_id', testFollowerId)
        .eq('following_id', testFollowingId);
      
      console.log('Delete test error:', deleteError);
    }
    
    return {
      allFollowers,
      structureData,
      insertData,
      errors: { allError, structureError, insertError }
    };
  } catch (error) {
    console.error('Error testing followers table:', error);
    return null;
  }
};
