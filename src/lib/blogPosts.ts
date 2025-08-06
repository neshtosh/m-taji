import { supabase } from './supabase';

export interface BlogPost {
  id: string;
  author_id: string;
  title: string;
  body: string;
  excerpt?: string;
  cover_image?: string;
  slug: string;
  author_name: string;
  tags: string[];
  is_published: boolean;
  published_at?: string;
  views: number;
  read_time: number;
  created_at: string;
  updated_at: string;
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
      .eq('author_id', userId)
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
    console.log('Fetching published blog posts...');
    
    // First, let's check all blog posts to see what's in the database
    const { data: allPosts, error: allError } = await supabase
      .from('blog_posts')
      .select('*');
    
    console.log('All blog posts in database:', allPosts);
    console.log('All posts error:', allError);
    
    // Log details of each blog post
    if (allPosts && allPosts.length > 0) {
      allPosts.forEach((post, index) => {
        console.log(`Blog post ${index + 1}:`, {
          id: post.id,
          title: post.title,
          is_published: post.is_published,
          published_at: post.published_at,
          created_at: post.created_at,
          author_id: post.author_id
        });
      });
    }
    
    // Now fetch only published posts
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        author:profiles(name, email)
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    console.log('Published blog posts:', data);
    console.log('Published posts error:', error);

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
export const createBlogPost = async (postData: Omit<BlogPost, 'id' | 'author_id' | 'created_at' | 'updated_at' | 'views' | 'read_time'>): Promise<BlogPost | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No authenticated user');
      return null;
    }

    // Validate required fields
    if (!postData.title || !postData.body) {
      console.error('Missing required fields: title and body');
      return null;
    }

    // Generate slug from title
    const slug = postData.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now();

    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        ...postData,
        slug,
        author_id: user.id,
        author_name: user.user_metadata?.name || user.email || 'User',
        read_time: calculateReadTime(postData.body),
        excerpt: postData.excerpt || generateExcerpt(postData.body)
      })
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
        is_published: true,
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
        is_published: false,
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

    // Try different bucket names in order of preference
    const bucketNames = ['blog-images', 'project-images', 'images', 'uploads'];
    let uploadSuccess = false;
    let publicUrl = '';

    for (const bucketName of bucketNames) {
      try {
        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (!uploadError) {
          const { data: { publicUrl: url } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);
          
          publicUrl = url;
          uploadSuccess = true;
          break;
        }
      } catch (bucketError) {
        console.log(`Bucket ${bucketName} not available, trying next...`);
        continue;
      }
    }

    if (!uploadSuccess) {
      throw new Error('No storage bucket available. Please create a bucket named "blog-images" or "project-images" in your Supabase project.');
    }

    return publicUrl;
  } catch (error) {
    console.error('Error uploading blog image:', error);
    throw error;
  }
};

// Calculate estimated read time based on content length
export const calculateReadTime = (content: string): number => {
  if (!content || typeof content !== 'string') {
    return 1; // Default to 1 minute if no content
  }
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(readTime, 1); // Minimum 1 minute
};

// Generate excerpt from content
export const generateExcerpt = (content: string, maxLength: number = 150): string => {
  if (!content || typeof content !== 'string') {
    return '';
  }
  const plainText = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
  if (plainText.length <= maxLength) {
    return plainText;
  }
  return plainText.substring(0, maxLength).trim() + '...';
}; 