import { supabase } from './supabase';

export interface ProfileData {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  website?: string;
  phone?: string;
  social_links?: any;
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdateData {
  name?: string;
  bio?: string;
  location?: string;
  website?: string;
  phone?: string;
  avatar_url?: string;
}

export const getCurrentUserProfile = async (): Promise<ProfileData | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getCurrentUserProfile:', error);
    return null;
  }
};

export const updateUserProfile = async (updateData: ProfileUpdateData): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)
      .select();

    if (error) {
      console.error('Error updating profile:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    return false;
  }
};

export const uploadProfilePhoto = async (file: File): Promise<string | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Validate file
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;

    // Try to upload to Supabase storage first
    try {
      const { data, error } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, file);

      if (error) {
        console.log('Storage upload failed, using base64 fallback:', error);
        throw error;
      }

      const { data: urlData } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(fileName);

      if (urlData.publicUrl) {
        // Update profile with the new avatar URL
        await updateUserProfile({ avatar_url: urlData.publicUrl });
        return urlData.publicUrl;
      }
    } catch (storageError) {
      console.log('Storage upload failed, using base64 fallback:', storageError);
      
      // Fallback: Convert to base64 and store in database
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64String = e.target?.result as string;
          console.log('Base64 conversion result length:', base64String?.length);
          if (base64String) {
            const updateResult = await updateUserProfile({ avatar_url: base64String });
            console.log('Profile update result:', updateResult);
            resolve(base64String);
          } else {
            console.log('Base64 conversion failed');
            resolve(null);
          }
        };
        reader.onerror = (error) => {
          console.error('FileReader error:', error);
          resolve(null);
        };
        reader.readAsDataURL(file);
      });
    }

    return null;
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    return null;
  }
};

export const deleteProfilePhoto = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // Get current profile to find the photo URL
    const profile = await getCurrentUserProfile();
    if (!profile?.avatar_url) return true; // No photo to delete

    // If it's a storage URL, try to delete from storage
    if (profile.avatar_url.startsWith('http')) {
      try {
        const fileName = profile.avatar_url.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('profile-photos')
            .remove([fileName]);
        }
      } catch (storageError) {
        console.log('Storage delete failed, continuing with profile update');
      }
    }

    // Update profile to remove avatar_url
    await updateUserProfile({ avatar_url: undefined });
    return true;
  } catch (error) {
    console.error('Error deleting profile photo:', error);
    return false;
  }
};

export const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      console.error('Error updating password:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updatePassword:', error);
    return false;
  }
};

export const deleteAccount = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // Delete user from auth (this will cascade to delete profile and other data)
    const { error } = await supabase.auth.admin.deleteUser(user.id);
    
    if (error) {
      console.error('Error deleting account:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteAccount:', error);
    return false;
  }
};
