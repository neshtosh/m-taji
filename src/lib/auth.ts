import { supabase } from './supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

/**
 * Get the current user's profile from the database
 */
export const getCurrentUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role
    };
  } catch (error) {
    console.error('Error getting current user profile:', error);
    return null;
  }
};

/**
 * Update the current user's profile
 */
export const updateUserProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) {
      console.error('Error updating user profile:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
};

/**
 * Check if the current user is an admin
 */
export const isUserAdmin = async (): Promise<boolean> => {
  const profile = await getCurrentUserProfile();
  return profile?.role === 'admin';
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<void> => {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Error signing out:', error);
  }
}; 