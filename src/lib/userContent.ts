import { supabase } from './supabase';

export const fetchUserBlogPosts = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('author_id', userId)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user blog posts:', error);
    return [];
  }
};

export const fetchUserMicroblogPosts = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('microblog_posts')
      .select('*')
      .eq('author_id', userId)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user microblog posts:', error);
    return [];
  }
};

export const fetchUserProducts = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('author_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user products:', error);
    return [];
  }
}; 