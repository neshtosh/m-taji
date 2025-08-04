import { supabase } from './supabase';

export interface UserProject {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: 'education' | 'health' | 'agriculture' | 'environment' | 'economic' | 'technology';
  impact_description: string;
  completion_date: string;
  image_url?: string;
  video_url?: string;
  status: 'completed' | 'in_progress' | 'planned';
  created_at: string;
  updated_at: string;
}

export interface FundraisingCampaign {
  id: string;
  project_id: string;
  title: string;
  description: string;
  funding_goal: number;
  raised_amount: number;
  campaign_duration: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface ProjectWithCampaign extends UserProject {
  fundraising_campaign?: FundraisingCampaign;
}

// Fetch all projects for the current user
export const fetchUserProjects = async (userId: string): Promise<ProjectWithCampaign[]> => {
  try {
    const { data, error } = await supabase
      .from('user_projects')
      .select(`
        *,
        fundraising_campaigns(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user projects:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching user projects:', error);
    return [];
  }
};

// Create a new project
export const createUserProject = async (projectData: Omit<UserProject, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<UserProject | null> => {
  try {
    const { data, error } = await supabase
      .from('user_projects')
      .insert(projectData)
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error creating project:', error);
    return null;
  }
};

// Update a project
export const updateUserProject = async (projectId: string, updates: Partial<UserProject>): Promise<UserProject | null> => {
  try {
    const { data, error } = await supabase
      .from('user_projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single();

    if (error) {
      console.error('Error updating project:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error updating project:', error);
    return null;
  }
};

// Delete a project
export const deleteUserProject = async (projectId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_projects')
      .delete()
      .eq('id', projectId);

    if (error) {
      console.error('Error deleting project:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    return false;
  }
};

// Create a fundraising campaign
export const createFundraisingCampaign = async (campaignData: Omit<FundraisingCampaign, 'id' | 'created_at' | 'updated_at'>): Promise<FundraisingCampaign | null> => {
  try {
    const { data, error } = await supabase
      .from('fundraising_campaigns')
      .insert(campaignData)
      .select()
      .single();

    if (error) {
      console.error('Error creating fundraising campaign:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error creating fundraising campaign:', error);
    return null;
  }
};

// Create storage buckets if they don't exist
const ensureStorageBuckets = async () => {
  try {
    // Check if project-images bucket exists, if not create it
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketNames = buckets?.map(bucket => bucket.name) || [];
    
    if (!bucketNames.includes('project-images')) {
      await supabase.storage.createBucket('project-images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB
      });
    }
    
    if (!bucketNames.includes('project-videos')) {
      await supabase.storage.createBucket('project-videos', {
        public: true,
        allowedMimeTypes: ['video/mp4', 'video/webm', 'video/ogg'],
        fileSizeLimit: 52428800 // 50MB
      });
    }
  } catch (error) {
    console.error('Error ensuring storage buckets:', error);
  }
};

// Upload project image
export const uploadProjectImage = async (file: File, projectId: string): Promise<string | null> => {
  try {
    // Ensure buckets exist
    await ensureStorageBuckets();
    
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
    const fileName = `${projectId}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      throw new Error('Failed to upload image. Please try again.');
    }

    const { data: { publicUrl } } = supabase.storage
      .from('project-images')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading project image:', error);
    throw error;
  }
};

// Upload project video
export const uploadProjectVideo = async (file: File, projectId: string): Promise<string | null> => {
  try {
    // Ensure buckets exist
    await ensureStorageBuckets();
    
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
    const fileName = `${projectId}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('project-videos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Error uploading video:', uploadError);
      throw new Error('Failed to upload video. Please try again.');
    }

    const { data: { publicUrl } } = supabase.storage
      .from('project-videos')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading project video:', error);
    throw error;
  }
};

// Delete project media files
export const deleteProjectMedia = async (projectId: string): Promise<boolean> => {
  try {
    // List and delete all files for this project
    const { data: imageFiles } = await supabase.storage
      .from('project-images')
      .list('', {
        search: projectId
      });
    
    const { data: videoFiles } = await supabase.storage
      .from('project-videos')
      .list('', {
        search: projectId
      });
    
    // Delete image files
    if (imageFiles && imageFiles.length > 0) {
      const imagePaths = imageFiles.map(file => file.name);
      await supabase.storage
        .from('project-images')
        .remove(imagePaths);
    }
    
    // Delete video files
    if (videoFiles && videoFiles.length > 0) {
      const videoPaths = videoFiles.map(file => file.name);
      await supabase.storage
        .from('project-videos')
        .remove(videoPaths);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting project media:', error);
    return false;
  }
}; 

// Fetch a single project by ID
export const fetchProjectById = async (projectId: string): Promise<ProjectWithCampaign | null> => {
  try {
    const { data, error } = await supabase
      .from('user_projects')
      .select(`
        *,
        fundraising_campaigns(*)
      `)
      .eq('id', projectId)
      .single();

    if (error) {
      console.error('Error fetching project:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}; 