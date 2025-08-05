import { supabase } from './supabase';

export interface MicroblogPost {
  id: string;
  author_id: string;
  title: string;
  content: string;
  category: string;
  media: any;
  author_name: string;
  is_published: boolean;
  likes: number;
  shares: number;
  created_at: string;
  updated_at: string;
}

export interface MicroblogPostWithAuthor extends MicroblogPost {
  author: {
    name: string;
    email: string;
  };
}

// Fetch all microblog posts for the current user
export const fetchUserMicroblogPosts = async (userId: string): Promise<MicroblogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('microblog_posts')
      .select('*')
      .eq('author_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user microblog posts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching user microblog posts:', error);
    return [];
  }
};

// Fetch all published microblog posts (for public viewing)
export const fetchAllMicroblogPosts = async (): Promise<MicroblogPostWithAuthor[]> => {
  try {
    const { data, error } = await supabase
      .from('microblog_posts')
      .select(`
        *,
        author:profiles(name, email)
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching microblog posts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching microblog posts:', error);
    return [];
  }
};

// Create a new microblog post
export const createMicroblogPost = async (postData: Omit<MicroblogPost, 'id' | 'author_id' | 'created_at' | 'updated_at' | 'likes' | 'shares'>): Promise<MicroblogPost | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No authenticated user');
      return null;
    }

    const { data, error } = await supabase
      .from('microblog_posts')
      .insert({
        ...postData,
        author_id: user.id,
        author_name: user.user_metadata?.name || user.email || 'User'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating microblog post:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error creating microblog post:', error);
    return null;
  }
};

// Update a microblog post
export const updateMicroblogPost = async (postId: string, updates: Partial<MicroblogPost>): Promise<MicroblogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('microblog_posts')
      .update(updates)
      .eq('id', postId)
      .select()
      .single();

    if (error) {
      console.error('Error updating microblog post:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error updating microblog post:', error);
    return null;
  }
};

// Delete a microblog post
export const deleteMicroblogPost = async (postId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('microblog_posts')
      .delete()
      .eq('id', postId);

    if (error) {
      console.error('Error deleting microblog post:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting microblog post:', error);
    return false;
  }
};

// Like a microblog post
export const likeMicroblogPost = async (postId: string): Promise<MicroblogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('microblog_posts')
      .update({
        likes: supabase.rpc('increment', { value: 1 })
      })
      .eq('id', postId)
      .select()
      .single();

    if (error) {
      console.error('Error liking microblog post:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error liking microblog post:', error);
    return null;
  }
};

// Upload microblog image
export const uploadMicroblogImage = async (file: File, postId: string): Promise<string | null> => {
  try {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.');
    }
    
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size too large. Please upload an image smaller than 5MB.');
    }
    
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const fileName = `microblog-${postId}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Error uploading microblog image:', uploadError);
      throw new Error('Failed to upload image. Please try again.');
    }

    const { data: { publicUrl } } = supabase.storage
      .from('project-images')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading microblog image:', error);
    throw error;
  }
};

// Upload microblog video
export const uploadMicroblogVideo = async (file: File, postId: string): Promise<string | null> => {
  try {
    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload an MP4, WebM, or OGG video.');
    }
    
    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      throw new Error('File size too large. Please upload a video smaller than 50MB.');
    }
    
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const fileName = `microblog-${postId}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('project-videos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Error uploading microblog video:', uploadError);
      throw new Error('Failed to upload video. Please try again.');
    }

    const { data: { publicUrl } } = supabase.storage
      .from('project-videos')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading microblog video:', error);
    throw error;
  }
};

// Format relative time
export const formatRelativeTime = (dateString: string): string => {
  const now = new Date();
  const postDate = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return postDate.toLocaleDateString();
  }
}; 