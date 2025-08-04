import { supabase } from './supabase';

export interface BlogPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  excerpt?: string;
  featured_image_url?: string;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  read_time: number;
  views_count: number;
  likes_count: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface BlogPostWithAuthor extends BlogPost {
  author: {
    name: string;
    email: string;
  };
}

// Fetch all blog posts for the current user
export const fetchUserBlogPosts = async (userId: string): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user blog posts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching user blog posts:', error);
    return [];
  }
};

// Fetch all published blog posts (for public viewing)
export const fetchPublishedBlogPosts = async (): Promise<BlogPostWithAuthor[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        author:profiles(name, email)
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching published blog posts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching published blog posts:', error);
    return [];
  }
};

// Fetch a single blog post by ID
export const fetchBlogPostById = async (postId: string): Promise<BlogPostWithAuthor | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        author:profiles(name, email)
      `)
      .eq('id', postId)
      .single();

    if (error) {
      console.error('Error fetching blog post:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
};

// Create a new blog post
export const createBlogPost = async (postData: Omit<BlogPost, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'views_count' | 'likes_count'>): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(postData)
      .select()
      .single();

    if (error) {
      console.error('Error creating blog post:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error creating blog post:', error);
    return null;
  }
};

// Update a blog post
export const updateBlogPost = async (postId: string, updates: Partial<BlogPost>): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', postId)
      .select()
      .single();

    if (error) {
      console.error('Error updating blog post:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error updating blog post:', error);
    return null;
  }
};

// Delete a blog post
export const deleteBlogPost = async (postId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', postId);

    if (error) {
      console.error('Error deleting blog post:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return false;
  }
};

// Publish a blog post
export const publishBlogPost = async (postId: string): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        status: 'published',
        published_at: new Date().toISOString()
      })
      .eq('id', postId)
      .select()
      .single();

    if (error) {
      console.error('Error publishing blog post:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error publishing blog post:', error);
    return null;
  }
};

// Unpublish a blog post
export const unpublishBlogPost = async (postId: string): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        status: 'draft',
        published_at: null
      })
      .eq('id', postId)
      .select()
      .single();

    if (error) {
      console.error('Error unpublishing blog post:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error unpublishing blog post:', error);
    return null;
  }
};

// Upload blog featured image
export const uploadBlogImage = async (file: File, postId: string): Promise<string | null> => {
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
    const fileName = `blog-${postId}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Error uploading blog image:', uploadError);
      throw new Error('Failed to upload image. Please try again.');
    }

    const { data: { publicUrl } } = supabase.storage
      .from('project-images')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading blog image:', error);
    throw error;
  }
};

// Calculate estimated read time based on content length
export const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(readTime, 1); // Minimum 1 minute
};

// Generate excerpt from content
export const generateExcerpt = (content: string, maxLength: number = 150): string => {
  const plainText = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
  if (plainText.length <= maxLength) {
    return plainText;
  }
  return plainText.substring(0, maxLength).trim() + '...';
}; 