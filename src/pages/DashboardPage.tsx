import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { 
  Users, 
  Target, 
  TrendingUp, 

  MapPin, 
  
  Heart, 
  MessageCircle,
  Plus,
  Upload,
  FileText,
  Image,
  Video,
  Link as LinkIcon,
  Share2,
  Search,
  X,
  Edit,
  Trash2
} from 'lucide-react';
import { 
  fetchUserProjects, 
  createUserProject, 
  updateUserProject, 
  deleteUserProject,
  createFundraisingCampaign,
  uploadProjectImage,
  uploadProjectVideo,
  deleteProjectMedia,
  UserProject,
  ProjectWithCampaign
} from '../lib/userProjects';
import {
  fetchUserBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  publishBlogPost,
  unpublishBlogPost,
  uploadBlogImage,
  calculateReadTime,
  generateExcerpt,
  BlogPost
} from '../lib/blogPosts';
import {
  fetchUserMicroblogPosts,
  createMicroblogPost,
  updateMicroblogPost,
  deleteMicroblogPost,
  likeMicroblogPost,
  uploadMicroblogImage,
  uploadMicroblogVideo,
  formatRelativeTime,
  MicroblogPost
} from '../lib/microblogPosts';
import { fetchAllUserProfiles } from '../lib/changemakers';
import { getCurrentUserProfile } from '../lib/profileManagement';
// import ShopManagement from '../components/dashboard/ShopManagement';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const projectsPerPage = 6;

  // Projects state
  const [projects, setProjects] = useState<ProjectWithCampaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingProject, setEditingProject] = useState<UserProject | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'education' as 'education' | 'health' | 'agriculture' | 'environment' | 'economic' | 'technology',
    impact_description: '',
    completion_date: '',
    image_url: '',
    video_url: ''
  });

  // Fundraising form state
  const [fundraisingData, setFundraisingData] = useState({
    enableFundraising: false,
    funding_goal: 0,
    campaign_duration: 30
  });

  // File upload state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{ image: number; video: number }>({ image: 0, video: 0 });
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Blog state
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [blogLoading, setBlogLoading] = useState(false);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);
  const [selectedBlogImage, setSelectedBlogImage] = useState<File | null>(null);
  const [blogUploadProgress, setBlogUploadProgress] = useState<number>(0);
  const [blogUploadError, setBlogUploadError] = useState<string | null>(null);

  // Blog form state
  const [blogFormData, setBlogFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: [] as string[],
    status: 'draft' as 'draft' | 'published' | 'archived'
  });

  // Microblog state
  const [microblogPosts, setMicroblogPosts] = useState<MicroblogPost[]>([]);
  const [microblogLoading, setMicroblogLoading] = useState(false);
  const [microblogContent, setMicroblogContent] = useState('');
  const [microblogCategory, setMicroblogCategory] = useState<'job' | 'event' | 'news' | 'announcement'>('news');
  const [selectedMicroblogImage, setSelectedMicroblogImage] = useState<File | null>(null);
  const [selectedMicroblogVideo, setSelectedMicroblogVideo] = useState<File | null>(null);
  const [microblogUploadProgress, setMicroblogUploadProgress] = useState<{ image: number; video: number }>({ image: 0, video: 0 });
  const [microblogUploadError, setMicroblogUploadError] = useState<string | null>(null);
  const [postingMicroblog, setPostingMicroblog] = useState(false);

  // Youth leaders state
  const [youthLeaders, setYouthLeaders] = useState<any[]>([]);
  const [youthLeadersLoading, setYouthLeadersLoading] = useState(false);

  // Profile data state
  const [profileData, setProfileData] = useState<any>(null);

  // Dashboard metrics state
  const [dashboardMetrics, setDashboardMetrics] = useState({
    totalProjects: 0,
    completedProjects: 0,
    inProgressProjects: 0,
    totalBlogPosts: 0,
    publishedBlogPosts: 0,
    totalMicroblogPosts: 0,
    totalFundraisingCampaigns: 0,
    totalFundsRaised: 0,
    totalFundraisingGoal: 0,
    averageProjectCompletionTime: 0,
    topCategory: '',
    memberSince: ''
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: Users },
    { id: 'projects', name: 'Projects', icon: Target },
    { id: 'blog', name: 'Blog', icon: FileText },
    { id: 'microblog', name: 'Microblog', icon: MessageCircle },
    { id: 'shop', name: 'Shop', icon: TrendingUp }
  ];

  const metrics = [
    { name: 'Total Projects', value: '12', icon: Target, color: 'text-primary', bgColor: 'bg-primary/20' },
    { name: 'Blog Posts', value: '8', icon: FileText, color: 'text-secondary', bgColor: 'bg-secondary/20' },
    { name: 'Microblogs', value: '24', icon: MessageCircle, color: 'text-primary', bgColor: 'bg-primary/20' },
    { name: 'Total Impact', value: '2.5K', icon: TrendingUp, color: 'text-secondary', bgColor: 'bg-secondary/20' }
  ];

  // Fetch projects on component mount and when activeTab changes
  useEffect(() => {
    if (!user) return;
    
    try {
      if (activeTab === 'projects') {
        fetchProjects();
      }
      if (activeTab === 'blog') {
        fetchBlogPosts();
      }
      if (activeTab === 'microblog') {
        fetchMicroblogPosts();
      }
      if (activeTab === 'profile') {
        fetchYouthLeaders();
        fetchProjects();
        fetchBlogPosts();
        fetchMicroblogPosts();
        fetchProfileData();
      }
    } catch (error) {
      console.error('Error in useEffect:', error);
    }
  }, [activeTab, user]);

  // Calculate metrics when data changes
  useEffect(() => {
    if (user) {
      calculateDashboardMetrics();
    }
  }, [projects, blogPosts, microblogPosts, user]);

  // Add timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.log('Loading timeout reached, forcing dashboard to render');
        setLoading(false);
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeout);
  }, [loading]);

  const fetchProjects = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userProjects = await fetchUserProjects(user.id);
      setProjects(userProjects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      // If table doesn't exist, just set empty array
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogPosts = async () => {
    if (!user) return;
    
    setBlogLoading(true);
    try {
      const userBlogPosts = await fetchUserBlogPosts(user.id);
      setBlogPosts(userBlogPosts || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      // If table doesn't exist, just set empty array
      setBlogPosts([]);
    } finally {
      setBlogLoading(false);
    }
  };

  const fetchMicroblogPosts = async () => {
    if (!user) return;
    
    setMicroblogLoading(true);
    try {
      const userMicroblogPosts = await fetchUserMicroblogPosts(user.id);
      setMicroblogPosts(userMicroblogPosts || []);
    } catch (error) {
      console.error('Error fetching microblog posts:', error);
      // If table doesn't exist, just set empty array
      setMicroblogPosts([]);
    } finally {
      setMicroblogLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFundraisingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFundraisingData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
      
      if (type === 'image' && !allowedImageTypes.includes(file.type)) {
        setUploadError('Please select a valid image file (JPEG, PNG, GIF, or WebP).');
        return;
      }
      
      if (type === 'video' && !allowedVideoTypes.includes(file.type)) {
        setUploadError('Please select a valid video file (MP4, WebM, or OGG).');
        return;
      }
      
      // Validate file size
      const maxImageSize = 5 * 1024 * 1024; // 5MB
      const maxVideoSize = 50 * 1024 * 1024; // 50MB
      
      if (type === 'image' && file.size > maxImageSize) {
        setUploadError('Image file size must be less than 5MB.');
        return;
      }
      
      if (type === 'video' && file.size > maxVideoSize) {
        setUploadError('Video file size must be less than 50MB.');
        return;
      }
      
      // Clear any previous errors
      setUploadError(null);
      
      if (type === 'image') {
        setSelectedImage(file);
      } else {
        setSelectedVideo(file);
      }
    }
  };

  const handleBlogFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBlogFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBlogImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setBlogUploadError('Please select a valid image file (JPEG, PNG, GIF, or WebP).');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setBlogUploadError('Image file size must be less than 5MB.');
        return;
      }
      
      setBlogUploadError(null);
      setSelectedBlogImage(file);
    }
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsString = e.target.value;
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setBlogFormData(prev => ({
      ...prev,
      tags
    }));
  };

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setUploadError(null);
    
    try {
      let imageUrl = formData.image_url;
      let videoUrl = formData.video_url;

      if (editingProject) {
        // Update existing project
        const projectData = {
          ...formData,
          image_url: imageUrl,
          video_url: videoUrl,
          user_id: user.id,
          status: 'completed' as const
        };

        // Upload new files if selected
        try {
          if (selectedImage) {
            setUploadProgress(prev => ({ ...prev, image: 50 }));
            const uploadedImageUrl = await uploadProjectImage(selectedImage, editingProject.id);
            if (uploadedImageUrl) {
              projectData.image_url = uploadedImageUrl;
            }
            setUploadProgress(prev => ({ ...prev, image: 100 }));
          }

          if (selectedVideo) {
            setUploadProgress(prev => ({ ...prev, video: 50 }));
            const uploadedVideoUrl = await uploadProjectVideo(selectedVideo, editingProject.id);
            if (uploadedVideoUrl) {
              projectData.video_url = uploadedVideoUrl;
            }
            setUploadProgress(prev => ({ ...prev, video: 100 }));
          }
        } catch (uploadError: any) {
          console.error('Error uploading files:', uploadError);
          setUploadError(uploadError.message || 'Failed to upload files. Please try again.');
          return;
        }

        // Update the project
        const updatedProject = await updateUserProject(editingProject.id, projectData);
        
        if (updatedProject) {
          // Reset form and refresh projects
          resetForm();
          setEditingProject(null);
          await fetchProjects();
          setShowUploadForm(false);
          setUploadProgress({ image: 0, video: 0 });
        }
      } else {
        // Create new project
        const projectData = {
          ...formData,
          image_url: imageUrl,
          video_url: videoUrl,
          user_id: user.id,
          status: 'completed' as const
        };

        const newProject = await createUserProject(projectData);
        
        if (newProject) {
          // Upload files with the actual project ID
          try {
            if (selectedImage) {
              setUploadProgress(prev => ({ ...prev, image: 50 }));
              const uploadedImageUrl = await uploadProjectImage(selectedImage, newProject.id);
              if (uploadedImageUrl) {
                // Update the project with the uploaded image URL
                await updateUserProject(newProject.id, { image_url: uploadedImageUrl });
              }
              setUploadProgress(prev => ({ ...prev, image: 100 }));
            }

            if (selectedVideo) {
              setUploadProgress(prev => ({ ...prev, video: 50 }));
              const uploadedVideoUrl = await uploadProjectVideo(selectedVideo, newProject.id);
              if (uploadedVideoUrl) {
                // Update the project with the uploaded video URL
                await updateUserProject(newProject.id, { video_url: uploadedVideoUrl });
              }
              setUploadProgress(prev => ({ ...prev, video: 100 }));
            }
          } catch (uploadError: any) {
            console.error('Error uploading files:', uploadError);
            setUploadError(uploadError.message || 'Failed to upload files. Please try again.');
            
            // If file upload fails, delete the project
            await deleteUserProject(newProject.id);
            return;
          }

          // Create fundraising campaign if enabled
          if (fundraisingData.enableFundraising) {
            const campaignData = {
              project_id: newProject.id,
              title: `Fundraising for ${newProject.title}`,
              description: `Help us scale this project and create greater impact`,
              funding_goal: fundraisingData.funding_goal,
              raised_amount: 0,
              campaign_duration: fundraisingData.campaign_duration,
              start_date: new Date().toISOString().split('T')[0],
              end_date: new Date(Date.now() + fundraisingData.campaign_duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              status: 'active' as const
            };

            await createFundraisingCampaign(campaignData);
          }

          // Reset form and refresh projects
          resetForm();
          await fetchProjects();
          setShowUploadForm(false);
          setUploadProgress({ image: 0, video: 0 });
        }
      }
    } catch (error: any) {
      console.error('Error saving project:', error);
      setUploadError(error.message || 'Failed to save project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'education',
      impact_description: '',
      completion_date: '',
      image_url: '',
      video_url: ''
    });
    setFundraisingData({
      enableFundraising: false,
      funding_goal: 0,
      campaign_duration: 30
    });
    setSelectedImage(null);
    setSelectedVideo(null);
    setUploadProgress({ image: 0, video: 0 });
    setUploadError(null);
  };

  const resetBlogForm = () => {
    setBlogFormData({
      title: '',
      content: '',
      excerpt: '',
      tags: [],
      status: 'draft'
    });
    setSelectedBlogImage(null);
    setBlogUploadProgress(0);
    setBlogUploadError(null);
  };

  const handleSubmitBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setBlogLoading(true);
    setBlogUploadError(null);
    
    try {
      // Validate required fields
      if (!blogFormData.title || !blogFormData.content) {
        setBlogUploadError('Title and content are required');
        setBlogLoading(false);
        return;
      }

      // Calculate read time and generate excerpt
      const readTime = calculateReadTime(blogFormData.content);
      const excerpt = blogFormData.excerpt || generateExcerpt(blogFormData.content);

      if (editingBlogPost) {
        // Update existing blog post
        let postData: Partial<BlogPost> = {
          title: blogFormData.title,
          body: blogFormData.content, // Map content to body
          excerpt,
          tags: blogFormData.tags,
          is_published: blogFormData.status === 'published',
          read_time: readTime,
          slug: blogFormData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now(),
          author_name: user.email || 'User'
        };

        // Upload new image if selected
        if (selectedBlogImage) {
          setBlogUploadProgress(50);
          const uploadedImageUrl = await uploadBlogImage(selectedBlogImage, editingBlogPost.id);
          if (uploadedImageUrl) {
            postData.cover_image = uploadedImageUrl;
          }
          setBlogUploadProgress(100);
        }

        const updatedPost = await updateBlogPost(editingBlogPost.id, postData);
        
        if (updatedPost) {
          resetBlogForm();
          setEditingBlogPost(null);
          await fetchBlogPosts();
          setShowBlogForm(false);
          setBlogUploadProgress(0);
        }
      } else {
        // Create new blog post
        const postData = {
          title: blogFormData.title,
          body: blogFormData.content, // Map content to body
          excerpt,
          tags: blogFormData.tags,
          is_published: blogFormData.status === 'published',
          read_time: readTime,
          slug: blogFormData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now(),
          author_name: user.email || 'User'
        };

        const newPost = await createBlogPost(postData);
        
        if (newPost) {
          // Upload image if selected
          if (selectedBlogImage) {
            try {
              setBlogUploadProgress(50);
              const uploadedImageUrl = await uploadBlogImage(selectedBlogImage, newPost.id);
              if (uploadedImageUrl) {
                await updateBlogPost(newPost.id, { cover_image: uploadedImageUrl });
              }
              setBlogUploadProgress(100);
            } catch (imageError) {
              console.error('Image upload failed, but blog post was created:', imageError);
              // Don't fail the entire operation if image upload fails
              setBlogUploadProgress(100);
            }
          }

          resetBlogForm();
          await fetchBlogPosts();
          setShowBlogForm(false);
          setBlogUploadProgress(0);
        }
      }
    } catch (error: any) {
      console.error('Error saving blog post:', error);
      setBlogUploadError(error.message || 'Failed to save blog post. Please try again.');
    } finally {
      setBlogLoading(false);
    }
  };

  const handleEditBlogPost = (post: BlogPost) => {
    setEditingBlogPost(post);
    setBlogFormData({
      title: post.title,
      content: post.body, // Map body to content for the form
      excerpt: post.excerpt || '',
      tags: post.tags,
      status: post.is_published ? 'published' : 'draft'
    });
    setShowBlogForm(true);
  };

  const handleDeleteBlogPost = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      const success = await deleteBlogPost(postId);
      if (success) {
        await fetchBlogPosts();
      }
    }
  };

  const handlePublishBlogPost = async (postId: string) => {
    const success = await publishBlogPost(postId);
    if (success) {
      await fetchBlogPosts();
    }
  };

  const handleUnpublishBlogPost = async (postId: string) => {
    const success = await unpublishBlogPost(postId);
    if (success) {
      await fetchBlogPosts();
    }
  };

  // Microblog handlers
  const handleMicroblogContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMicroblogContent(e.target.value);
  };

  const handleMicroblogImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setMicroblogUploadError('Please select a valid image file (JPEG, PNG, GIF, or WebP).');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setMicroblogUploadError('Image file size must be less than 5MB.');
        return;
      }
      
      setMicroblogUploadError(null);
      setSelectedMicroblogImage(file);
    }
  };

  const handleMicroblogVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
      if (!allowedTypes.includes(file.type)) {
        setMicroblogUploadError('Please select a valid video file (MP4, WebM, or OGG).');
        return;
      }
      
      // Validate file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        setMicroblogUploadError('Video file size must be less than 50MB.');
        return;
      }
      
      setMicroblogUploadError(null);
      setSelectedMicroblogVideo(file);
    }
  };

  const handleSubmitMicroblogPost = async () => {
    if (!user || !microblogContent.trim()) return;

    setPostingMicroblog(true);
    setMicroblogUploadError(null);
    
    try {
      const postData = {
        title: microblogContent.trim().substring(0, 100), // Use first 100 chars as title
        content: microblogContent.trim(),
        category: microblogCategory, // Use selected category
        media: null, // Will be updated if media is uploaded
        author_name: user.email || 'User',
        is_published: true
      };

      const newPost = await createMicroblogPost(postData);
      
      if (newPost) {
        // Upload image if selected
        if (selectedMicroblogImage) {
          try {
            setMicroblogUploadProgress(prev => ({ ...prev, image: 50 }));
            const uploadedImageUrl = await uploadMicroblogImage(selectedMicroblogImage, newPost.id);
            if (uploadedImageUrl) {
              await updateMicroblogPost(newPost.id, { media: { image: uploadedImageUrl } });
            }
            setMicroblogUploadProgress(prev => ({ ...prev, image: 100 }));
          } catch (imageError) {
            console.error('Image upload failed, but microblog post was created:', imageError);
            setMicroblogUploadProgress(prev => ({ ...prev, image: 100 }));
          }
        }

        // Upload video if selected
        if (selectedMicroblogVideo) {
          try {
            setMicroblogUploadProgress(prev => ({ ...prev, video: 50 }));
            const uploadedVideoUrl = await uploadMicroblogVideo(selectedMicroblogVideo, newPost.id);
            if (uploadedVideoUrl) {
              await updateMicroblogPost(newPost.id, { media: { video: uploadedVideoUrl } });
            }
            setMicroblogUploadProgress(prev => ({ ...prev, video: 100 }));
          } catch (videoError) {
            console.error('Video upload failed, but microblog post was created:', videoError);
            setMicroblogUploadProgress(prev => ({ ...prev, video: 100 }));
          }
        }

        // Reset form
        setMicroblogContent('');
        setSelectedMicroblogImage(null);
        setSelectedMicroblogVideo(null);
        setMicroblogUploadProgress({ image: 0, video: 0 });
        
        // Refresh posts
        await fetchMicroblogPosts();
      }
    } catch (error: any) {
      console.error('Error creating microblog post:', error);
      setMicroblogUploadError(error.message || 'Failed to create post. Please try again.');
    } finally {
      setPostingMicroblog(false);
    }
  };

  const handleLikeMicroblogPost = async (postId: string) => {
    const success = await likeMicroblogPost(postId);
    if (success) {
      await fetchMicroblogPosts();
    }
  };

  const handleDeleteMicroblogPost = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const success = await deleteMicroblogPost(postId);
      if (success) {
        await fetchMicroblogPosts();
      }
    }
  };

  const handleEditProject = (project: UserProject) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      impact_description: project.impact_description,
      completion_date: project.completion_date,
      image_url: project.image_url || '',
      video_url: project.video_url || ''
    });
    setShowUploadForm(true);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project? This will also delete all associated media files.')) {
      try {
        // Delete associated media files first
        await deleteProjectMedia(projectId);
        
        // Then delete the project
        const success = await deleteUserProject(projectId);
        if (success) {
          await fetchProjects();
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        // Still try to delete the project even if media deletion fails
        const success = await deleteUserProject(projectId);
        if (success) {
          await fetchProjects();
        }
      }
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Fetch youth leaders data
  const fetchProfileData = async () => {
    try {
      if (!user) return;
      const profile = await getCurrentUserProfile();
      setProfileData(profile);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const fetchYouthLeaders = async () => {
    try {
      setYouthLeadersLoading(true);
      const profiles = await fetchAllUserProfiles();
      setYouthLeaders(profiles);
    } catch (error) {
      console.error('Error fetching youth leaders:', error);
    } finally {
      setYouthLeadersLoading(false);
    }
  };

  // Calculate dashboard metrics
  const calculateDashboardMetrics = () => {
    if (!user) return;

    // Project metrics
    const totalProjects = projects.length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const inProgressProjects = projects.filter(p => p.status === 'in_progress').length;
    
    // Blog metrics
    const totalBlogPosts = blogPosts.length;
    const publishedBlogPosts = blogPosts.filter(p => p.is_published).length;
    
    // Microblog metrics
    const totalMicroblogPosts = microblogPosts.length;
    
    // Fundraising metrics
    const fundraisingCampaigns = projects.flatMap(p => p.fundraising_campaign ? [p.fundraising_campaign] : []);
    const totalFundraisingCampaigns = fundraisingCampaigns.length;
    const totalFundsRaised = fundraisingCampaigns.reduce((sum, campaign) => sum + (campaign.raised_amount || 0), 0);
    const totalFundraisingGoal = fundraisingCampaigns.reduce((sum, campaign) => sum + (campaign.funding_goal || 0), 0);
    
    // Category analysis
    const categoryCounts = projects.reduce((acc, project) => {
      acc[project.category] = (acc[project.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topCategory = Object.entries(categoryCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';
    
    // Member since
    const memberSince = '2023'; // Default year since user.created_at might not be available
    
    setDashboardMetrics({
      totalProjects,
      completedProjects,
      inProgressProjects,
      totalBlogPosts,
      publishedBlogPosts,
      totalMicroblogPosts,
      totalFundraisingCampaigns,
      totalFundsRaised,
      totalFundraisingGoal,
      averageProjectCompletionTime: completedProjects > 0 ? Math.round(completedProjects / totalProjects * 100) : 0,
      topCategory,
      memberSince
    });
  };

  // Calculate real-time metrics for display
  const realMetrics = [
    { 
      name: 'Total Projects', 
      value: dashboardMetrics.totalProjects.toString(), 
      icon: Target, 
      color: 'text-primary', 
      bgColor: 'bg-primary/20' 
    },
    { 
      name: 'Blog Posts', 
      value: dashboardMetrics.totalBlogPosts.toString(), 
      icon: FileText, 
      color: 'text-secondary', 
      bgColor: 'bg-secondary/20' 
    },
    { 
      name: 'Microblogs', 
      value: dashboardMetrics.totalMicroblogPosts.toString(), 
      icon: MessageCircle, 
      color: 'text-primary', 
      bgColor: 'bg-primary/20' 
    },
    { 
      name: 'Total Impact', 
      value: `${dashboardMetrics.totalFundsRaised.toLocaleString()}`, 
      icon: TrendingUp, 
      color: 'text-secondary', 
      bgColor: 'bg-secondary/20' 
    }
  ];

  // Search functionality
  const filteredYouthLeaders = youthLeaders.filter((leader: any) => {
    const query = searchQuery.toLowerCase();
    return (
      (leader.name?.toLowerCase().includes(query) || false) ||
      (leader.location?.toLowerCase().includes(query) || false) ||
      (leader.role?.toLowerCase().includes(query) || false) ||
      (leader.category?.toLowerCase().includes(query) || false)
    );
  });

  // Get completed projects for display
  const projectsDone = projects.filter((project: ProjectWithCampaign) => project.status === 'completed');

  const renderProfileContent = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* Profile Overview */}
      <div className="lg:col-span-1">
        <div className="bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-700">
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
              {profileData?.avatar_url ? (
                <img 
                  src={profileData.avatar_url} 
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-900 dark:text-white font-bold text-2xl">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h3>
            <p className="text-gray-600 dark:text-gray-400">Youth Changemaker</p>
            <p className="text-sm text-gray-500 mt-1">Member since 2023</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Total Projects</span>
              <span className="font-medium text-blue-400">{dashboardMetrics.totalProjects}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Completed</span>
                              <span className="font-medium text-teal-400">{dashboardMetrics.completedProjects}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">In Progress</span>
              <span className="font-medium text-orange-400">{dashboardMetrics.inProgressProjects}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Success Rate</span>
              <span className="font-medium text-purple-400">{dashboardMetrics.averageProjectCompletionTime}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Top Category</span>
              <span className="font-medium text-primary">{dashboardMetrics.topCategory}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Blog Posts</span>
              <span className="font-medium text-indigo-400">{dashboardMetrics.totalBlogPosts}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Microblog Posts</span>
              <span className="font-medium text-pink-400">{dashboardMetrics.totalMicroblogPosts}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Fundraising</span>
              <span className="font-medium text-emerald-400">{dashboardMetrics.totalFundraisingCampaigns} campaigns</span>
            </div>
            {dashboardMetrics.totalFundsRaised > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Funds Raised</span>
                <span className="font-medium text-emerald-400">KSh {dashboardMetrics.totalFundsRaised.toLocaleString()}</span>
              </div>
            )}
          </div>

          <Link 
            to={`/profile/${user?.id}`}
            className="w-full mt-6 bg-primary hover:bg-primary-dark text-black font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            View My Profile
          </Link>
        </div>
      </div>

      {/* Projects Done */}
      <div className="lg:col-span-2 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Projects Done</h3>
            <span className="text-sm text-gray-400">{projectsDone.length} completed projects</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {projectsDone.slice(0, 4).map((project: ProjectWithCampaign) => (
              <div key={project.id} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <div className="flex items-start space-x-3">
                  <img 
                    src={project.image_url || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'} 
                    alt={project.title}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{project.title}</h4>
                    <p className="text-xs text-gray-400 mb-2 line-clamp-2">{project.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-primary-dark text-primary-light px-2 py-1 rounded-full">
                        {project.category}
                      </span>
                      <span className="text-xs text-gray-500">{project.completion_date}</span>
                    </div>
                    <p className="text-xs text-teal-400 mt-1">{project.impact_description}</p>
                    <div className="flex space-x-2 mt-2">
                      <button className="text-xs text-blue-400 hover:text-blue-300 font-medium">Fundraise</button>
                      <Link to={`/project/${project.id}`} className="text-xs text-gray-400 hover:text-gray-300">View</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {projectsDone.length > 4 && (
            <div className="mt-4 text-center">
                              <button
                  onClick={() => setActiveTab('projects')}
                  className="text-primary hover:text-primary-dark text-sm font-medium transition-colors py-2 px-3 rounded-lg hover:bg-primary/10"
                >
                  View All {projectsDone.length} Projects
                </button>
            </div>
          )}
        </div>
      </div>



      {/* Youth Leaders Section */}
      <div className="lg:col-span-3">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Youth Leaders</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {filteredYouthLeaders.length} of {youthLeaders.length} leaders
            </span>
          </div>
          
          {searchQuery && (
            <div className="mb-4 p-3 bg-primary/10 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing results for: <span className="font-semibold text-primary">"{searchQuery}"</span>
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filteredYouthLeaders.map((leader: any) => (
              <div key={leader.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-900 font-bold text-lg">
                      {leader.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{leader.name || 'Anonymous'}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Youth Changemaker</p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                      <MapPin className="h-3 w-3 mr-1" />
                      {leader.location || 'Kenya'}
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-gray-600 dark:text-gray-300">
                        • Member since {new Date(leader.created_at).getFullYear()}
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                        Active Member
                      </span>
                    </div>
                    <p className="text-xs text-teal-600 dark:text-teal-400 mt-1">Contributing to change</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredYouthLeaders.length === 0 && searchQuery && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No youth leaders found matching your search.</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-2 text-primary hover:text-primary-dark text-sm font-medium"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderProjectsContent = () => {
    // Calculate pagination
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
    const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

    return (
      <div className="space-y-6">
        {/* Upload New Project Form */}
        {showUploadForm && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 font-bold-rounded">
                {editingProject ? 'Edit Project' : 'Upload New Project'}
              </h3>
              <button
                onClick={() => {
                  setShowUploadForm(false);
                  setEditingProject(null);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
          </div>
          
            <form onSubmit={handleSubmitProject} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                <input 
                  type="text" 
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Enter project title"
                    required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  >
                  <option value="education">Education</option>
                  <option value="health">Health & Sanitation</option>
                  <option value="agriculture">Agriculture</option>
                  <option value="environment">Environment</option>
                  <option value="economic">Economic Development</option>
                  <option value="technology">Technology</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                rows={3}
                placeholder="Describe your project and its impact..."
                  required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Images</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={(e) => handleFileChange(e, 'image')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  {selectedImage && (
                    <div className="mt-2">
                      <p className="text-sm text-teal-600">✓ {selectedImage.name}</p>
                      <p className="text-xs text-gray-500">Size: {(selectedImage.size / 1024 / 1024).toFixed(2)} MB</p>
                      {uploadProgress.image > 0 && uploadProgress.image < 100 && (
                        <div className="mt-1">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress.image}%` }}
                            ></div>
                </div>
                          <p className="text-xs text-gray-500 mt-1">Uploading image...</p>
                        </div>
                      )}
                    </div>
                  )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Video</label>
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/ogg"
                    onChange={(e) => handleFileChange(e, 'video')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  {selectedVideo && (
                    <div className="mt-2">
                      <p className="text-sm text-teal-600">✓ {selectedVideo.name}</p>
                      <p className="text-xs text-gray-500">Size: {(selectedVideo.size / 1024 / 1024).toFixed(2)} MB</p>
                      {uploadProgress.video > 0 && uploadProgress.video < 100 && (
                        <div className="mt-1">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress.video}%` }}
                            ></div>
                </div>
                          <p className="text-xs text-gray-500 mt-1">Uploading video...</p>
                        </div>
                      )}
                    </div>
                  )}
              </div>
            </div>
              
              {/* File upload error message */}
              {uploadError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{uploadError}</p>
                </div>
              )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Impact Description</label>
                <input 
                  type="text" 
                    name="impact_description"
                    value={formData.impact_description}
                    onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="e.g., 500+ families served"
                    required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Completion Date</label>
                <input 
                  type="date" 
                    name="completion_date"
                    value={formData.completion_date}
                    onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                />
              </div>
            </div>
            
            {/* Fundraising Options */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-3 mb-3">
                <input 
                  type="checkbox" 
                  id="fundraise-project"
                    name="enableFundraising"
                    checked={fundraisingData.enableFundraising}
                    onChange={handleFundraisingChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="fundraise-project" className="text-sm font-medium text-blue-900">
                  Enable Fundraising for this Project
                </label>
              </div>
              <p className="text-xs text-blue-700 mb-3">
                Allow supporters to contribute financially to help scale this project and create greater impact.
              </p>
                {fundraisingData.enableFundraising && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-blue-800 mb-1">Funding Goal (KSh)</label>
                  <input 
                    type="number" 
                        name="funding_goal"
                        value={fundraisingData.funding_goal}
                        onChange={handleFundraisingChange}
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="e.g., 500,000"
                        required={fundraisingData.enableFundraising}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-blue-800 mb-1">Campaign Duration (Days)</label>
                  <input 
                    type="number" 
                        name="campaign_duration"
                        value={fundraisingData.campaign_duration}
                        onChange={handleFundraisingChange}
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="e.g., 30"
                        required={fundraisingData.enableFundraising}
                  />
                </div>
              </div>
                )}
            </div>
            
                            <button 
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-black font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? (editingProject ? 'Updating...' : 'Uploading...') : editingProject ? 'Update Project' : 'Upload Project'}
              </button>
            </form>
          </div>
        )}

        {/* Projects Header */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 font-bold-rounded">My Projects</h3>
              <p className="text-sm text-gray-500 mt-1">Showing {filteredProjects.length} projects</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowUploadForm(true)}
                className="bg-primary hover:bg-primary-dark text-black font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Filter:</span>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                >
                <option value="all">All Categories</option>
                <option value="education">Education</option>
                <option value="health">Health & Sanitation</option>
                <option value="agriculture">Agriculture</option>
                <option value="environment">Environment</option>
                <option value="economic">Economic Development</option>
                <option value="technology">Technology</option>
              </select>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading projects...</p>
            </div>
          )}

          {/* Projects Grid */}
          {!loading && (
            <>
              {currentProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {currentProjects.map((project) => (
              <div key={project.id} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                      <div className="relative">
                <img 
                          src={project.image_url || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'} 
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                        {project.video_url && (
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                            <div className="bg-white bg-opacity-90 rounded-full p-3">
                              <Video className="w-6 h-6 text-gray-800" />
                            </div>
                          </div>
                        )}
                      </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-primary/20 text-primary-dark px-2 py-1 rounded-full">
                      {project.category}
                    </span>
                          <span className="text-xs text-gray-500">{project.completion_date}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{project.title}</h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                  <div className="flex items-center justify-between">
                          <span className="text-sm text-teal-600 font-medium">{project.impact_description}</span>
                    <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEditProject(project)}
                              className="text-xs text-amber-600 hover:text-amber-700 font-medium"
                            >
                              <Edit className="w-3 h-3 inline mr-1" />
                              Edit
                            </button>
                      <button 
                        onClick={() => navigate(`/project/${project.id}`)}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        View
                      </button>
                            <button 
                              onClick={() => handleDeleteProject(project.id)}
                              className="text-xs text-red-600 hover:text-red-700 font-medium"
                            >
                              <Trash2 className="w-3 h-3 inline mr-1" />
                              Delete
                            </button>
                    </div>
                  </div>
                        {project.fundraising_campaign && (
                          <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-blue-800">Fundraising Active</span>
                              <span className="text-blue-600">
                                KSh {project.fundraising_campaign.raised_amount.toLocaleString()} / {project.fundraising_campaign.funding_goal.toLocaleString()}
                              </span>
                            </div>
                            <div className="w-full bg-blue-200 rounded-full h-1 mt-1">
                              <div 
                                className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                                style={{ width: `${(project.fundraising_campaign.raised_amount / project.fundraising_campaign.funding_goal) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                </div>
              </div>
            ))}
          </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
                  <p className="text-gray-600 mb-4">Start by uploading your first project to showcase your impact.</p>
                  <button
                    onClick={() => setShowUploadForm(true)}
                    className="bg-primary hover:bg-primary-dark text-black font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Upload Your First Project
                  </button>
                </div>
              )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 pt-6">
              <div className="text-sm text-gray-500">
                    Showing {indexOfFirstProject + 1} to {Math.min(indexOfLastProject, filteredProjects.length)} of {filteredProjects.length} projects
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-primary text-black font-semibold'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  const renderMicroblogContent = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 font-artistic italic">My Microblog</h3>
        <button className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-black font-semibold px-4 py-2 rounded-lg transition-colors">
          <Plus className="h-4 w-4" />
          <span>New Post</span>
        </button>
      </div>

      {/* Compose New Post */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex space-x-4 mb-4">
          <img 
            src={'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'} 
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <textarea 
              value={microblogContent}
              onChange={handleMicroblogContentChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              rows={3}
              placeholder="What's on your mind? Share your thoughts, updates, or inspiration..."
            />
            {/* File upload indicators */}
            {selectedMicroblogImage && (
              <div className="mt-2">
                                      <p className="text-sm text-teal-600">✓ {selectedMicroblogImage.name}</p>
                <p className="text-xs text-gray-500">Size: {(selectedMicroblogImage.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            )}
            {selectedMicroblogVideo && (
              <div className="mt-2">
                                      <p className="text-sm text-teal-600">✓ {selectedMicroblogVideo.name}</p>
                <p className="text-xs text-gray-500">Size: {(selectedMicroblogVideo.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            )}
            {/* Upload progress */}
            {(microblogUploadProgress.image > 0 || microblogUploadProgress.video > 0) && (
              <div className="mt-2 space-y-1">
                {microblogUploadProgress.image > 0 && (
                  <div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                  <div 
                              className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${microblogUploadProgress.image}%` }}
                            ></div>
                    </div>
                    <p className="text-xs text-gray-500">Uploading image...</p>
                  </div>
                )}
                {microblogUploadProgress.video > 0 && (
                  <div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                  <div 
                              className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${microblogUploadProgress.video}%` }}
                            ></div>
                    </div>
                    <p className="text-xs text-gray-500">Uploading video...</p>
                  </div>
                )}
              </div>
            )}
            {/* Error message */}
            {microblogUploadError && (
              <div className="mt-2">
                <p className="text-sm text-red-600">{microblogUploadError}</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <label className="p-2 text-gray-500 hover:text-primary transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleMicroblogImageChange}
                  className="hidden"
                />
                <Image className="h-5 w-5" />
              </label>
              <label className="p-2 text-gray-500 hover:text-primary transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/ogg"
                  onChange={handleMicroblogVideoChange}
                  className="hidden"
                />
                <Video className="h-5 w-5" />
              </label>
              <button className="p-2 text-gray-500 hover:text-primary transition-colors">
                <LinkIcon className="h-5 w-5" />
              </button>
            </div>
            <select
              value={microblogCategory}
              onChange={(e) => setMicroblogCategory(e.target.value as 'job' | 'event' | 'news' | 'announcement')}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="news">News</option>
              <option value="event">Event</option>
              <option value="job">Job</option>
              <option value="announcement">Announcement</option>
            </select>
          </div>
          <button 
            onClick={handleSubmitMicroblogPost}
            disabled={postingMicroblog || !microblogContent.trim()}
            className="bg-primary hover:bg-primary-dark text-black font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {postingMicroblog ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {microblogLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading posts...</p>
        </div>
      )}

      {/* Recent Posts */}
      {!microblogLoading && (
        <div className="space-y-4">
          {microblogPosts.length > 0 ? (
            microblogPosts.map((post) => (
              <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <img 
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" 
                      alt="Profile"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">Your Post</h4>
                      <p className="text-sm text-gray-500">{formatRelativeTime(post.created_at)}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteMicroblogPost(post.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-gray-700 mb-3">{post.content}</p>
                {/* Display image if exists */}
                {post.media?.image && (
                  <div className="mb-3">
                    <img 
                      src={post.media.image} 
                      alt="Post image"
                      className="w-full max-h-96 object-cover rounded-lg"
                    />
                  </div>
                )}
                {/* Display video if exists */}
                {post.media?.video && (
                  <div className="mb-3">
                    <video 
                      src={post.media.video} 
                      controls
                      className="w-full max-h-96 rounded-lg"
                    />
                  </div>
                )}
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <button 
                    onClick={() => handleLikeMicroblogPost(post.id)}
                    className="flex items-center space-x-1 hover:text-amber-600 transition-colors"
                  >
                    <Heart className="h-4 w-4" />
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-amber-600 transition-colors">
                    <MessageCircle className="h-4 w-4" />
                    <span>0</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-amber-600 transition-colors">
                    <Share2 className="h-4 w-4" />
                    <span>{post.shares}</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600">Start sharing your thoughts and updates with the community.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderBlogContent = () => (
    <div className="space-y-6">
      {/* Blog Form */}
      {showBlogForm && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 font-artistic italic">
              {editingBlogPost ? 'Edit Blog Post' : 'Write New Blog Post'}
            </h3>
            <button
              onClick={() => {
                setShowBlogForm(false);
                setEditingBlogPost(null);
                resetBlogForm();
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmitBlogPost} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Blog Title</label>
                <input 
                  type="text" 
                  name="title"
                  value={blogFormData.title}
                  onChange={handleBlogFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Enter blog title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select 
                  name="status"
                  value={blogFormData.status}
                  onChange={handleBlogFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleBlogImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              {selectedBlogImage && (
                <div className="mt-2">
                                        <p className="text-sm text-teal-600">✓ {selectedBlogImage.name}</p>
                  <p className="text-xs text-gray-500">Size: {(selectedBlogImage.size / 1024 / 1024).toFixed(2)} MB</p>
                  {blogUploadProgress > 0 && blogUploadProgress < 100 && (
                    <div className="mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div 
                              className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${blogUploadProgress}%` }}
                            ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Uploading image...</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
              <input 
                type="text" 
                value={blogFormData.tags.join(', ')}
                onChange={handleTagsChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="e.g., education, technology, youth"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt (optional)</label>
              <textarea 
                name="excerpt"
                value={blogFormData.excerpt}
                onChange={handleBlogFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                rows={2}
                placeholder="Brief description of your blog post..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea 
                name="content"
                value={blogFormData.content}
                onChange={handleBlogFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                rows={12}
                placeholder="Write your blog post content here..."
                required
              />
            </div>

            {/* Blog upload error message */}
            {blogUploadError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{blogUploadError}</p>
              </div>
            )}
            
            <button 
              type="submit"
              disabled={blogLoading}
              className="w-full bg-primary hover:bg-primary-dark text-black font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {blogLoading ? (editingBlogPost ? 'Updating...' : 'Publishing...') : editingBlogPost ? 'Update Post' : 'Publish Post'}
            </button>
          </form>
        </div>
      )}

      {/* Blog Posts List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 font-artistic italic">My Blog Posts</h3>
            <p className="text-sm text-gray-500 mt-1">Showing {blogPosts.length} posts</p>
          </div>
          <button 
            onClick={() => setShowBlogForm(true)}
            className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-black font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Write Blog</span>
          </button>
        </div>

        {/* Loading State */}
        {blogLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading blog posts...</p>
          </div>
        )}

        {/* Blog Posts Grid */}
        {!blogLoading && (
          <>
            {blogPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {blogPosts.map((post) => (
                  <div key={post.id} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <img 
                      src={post.cover_image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop'} 
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          post.is_published 
                            ? 'bg-teal-100 text-teal-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {post.is_published ? 'Published' : 'Draft'}
                        </span>
                        <span className="text-xs text-gray-500">{post.read_time} min read</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">{post.title}</h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-xs text-gray-500">+{post.tags.length - 3} more</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{post.views} views</span>
                          <span>0 likes</span>
                        </div>
                        <div className="flex space-x-2">
                                                <button 
                        onClick={() => handleEditBlogPost(post)}
                        className="text-xs text-primary hover:text-primary-dark font-medium"
                      >
                            <Edit className="w-3 h-3 inline mr-1" />
                            Edit
                          </button>
                          {!post.is_published ? (
                            <button 
                              onClick={() => handlePublishBlogPost(post.id)}
                              className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                            >
                              Publish
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleUnpublishBlogPost(post.id)}
                              className="text-xs text-primary hover:text-primary-dark font-medium"
                            >
                              Unpublish
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteBlogPost(post.id)}
                            className="text-xs text-red-600 hover:text-red-700 font-medium"
                          >
                            <Trash2 className="w-3 h-3 inline mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No blog posts yet</h3>
                <p className="text-gray-600 mb-4">Start writing your first blog post to share your thoughts and experiences.</p>
                <button
                  onClick={() => setShowBlogForm(true)}
                  className="bg-primary hover:bg-primary-dark text-black font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Write Your First Blog Post
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );


    const renderShopContent = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center py-12">
            <div className="text-teal-600 text-6xl mb-6">🛍️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Shop Coming Soon!</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              We're working hard to bring you an amazing shopping experience. 
              Soon you'll be able to create and manage your own online store with 
              beautiful products and seamless transactions.
            </p>
            <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-lg p-6">
              <h4 className="font-semibold text-teal-800 mb-3">What's Coming:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-teal-700">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span>Product Management</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span>Image Uploads</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span>Inventory Tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span>Secure Payments</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span>Order Management</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span>Analytics Dashboard</span>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <button className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                Get Notified When Available
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileContent();
      case 'projects':
        return renderProjectsContent();
      case 'microblog':
        return renderMicroblogContent();
      case 'blog':
        return renderBlogContent();
      case 'shop':
        return renderShopContent();
      default:
        return renderProfileContent();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Mobile Navigation Tabs - Only visible on mobile */}
      <div className="md:hidden bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex-shrink-0 text-sm ${
                  activeTab === tab.id
                    ? 'bg-primary text-black font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Dashboard Title - Only show on profile page */}
        {activeTab === 'profile' && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 font-bold-rounded mb-2">Your Dashboard</h1>
              <p className="text-gray-600">Manage your profile, projects, and community engagement</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              {realMetrics.map((metric) => (
                <div key={metric.name} className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${metric.bgColor}`}>
                      <metric.icon className={`h-6 w-6 ${metric.color}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Desktop Navigation Tabs - Hidden on mobile */}
        <div className="hidden md:block bg-white rounded-xl shadow-lg p-4 mb-6 border border-gray-200">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-black font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="relative">
          {loading && activeTab === 'profile' ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading dashboard...</p>
              </div>
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 