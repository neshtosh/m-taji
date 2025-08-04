import { supabase } from './supabase';

export interface ChangemakerProfile {
  id: string;
  profile_id: string;
  age: number;
  location: string;
  area: string;
  bio: string;
  impact: string;
  followers_count: number;
  projects_count: number;
  funds_raised: number;
  image_url: string;
  email?: string;
  phone?: string;
  website?: string;
  created_at: string;
  updated_at: string;
  profile: {
    name: string;
    email: string;
  };
  achievements: Achievement[];
  projects: Project[];
}

export interface Achievement {
  id: string;
  title: string;
  description?: string;
  year?: number;
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  target_amount: number;
  raised_amount: number;
  status: 'active' | 'completed' | 'paused';
  created_at: string;
  updated_at: string;
}

export const fetchChangemakerProfile = async (changemakerId: string): Promise<ChangemakerProfile | null> => {
  try {
    // Fetch changemaker data with profile information
    const { data: changemaker, error: changemakerError } = await supabase
      .from('changemakers')
      .select(`
        *,
        profile:profiles(name, email)
      `)
      .eq('id', changemakerId)
      .single();

    if (changemakerError) {
      console.error('Error fetching changemaker:', changemakerError);
      return null;
    }

    // Fetch achievements
    const { data: achievements, error: achievementsError } = await supabase
      .from('achievements')
      .select('*')
      .eq('changemaker_id', changemakerId)
      .order('year', { ascending: false });

    if (achievementsError) {
      console.error('Error fetching achievements:', achievementsError);
    }

    // Fetch projects
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .eq('changemaker_id', changemakerId)
      .order('created_at', { ascending: false });

    if (projectsError) {
      console.error('Error fetching projects:', projectsError);
    }

    return {
      ...changemaker,
      achievements: achievements || [],
      projects: projects || []
    };
  } catch (error) {
    console.error('Error fetching changemaker profile:', error);
    return null;
  }
};

export const fetchAllChangemakers = async (): Promise<ChangemakerProfile[]> => {
  try {
    const { data, error } = await supabase
      .from('changemakers')
      .select(`
        *,
        profile:profiles(name, email)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching changemakers:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching changemakers:', error);
    return [];
  }
};

// Fetch all user profiles for youth leaders section
export const fetchAllUserProfiles = async (): Promise<ChangemakerProfile[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user profiles:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching user profiles:', error);
    return [];
  }
}; 