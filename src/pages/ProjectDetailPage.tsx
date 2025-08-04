import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, Target, Award, Share2, Heart, MessageCircle, Eye } from 'lucide-react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { fetchProjectById, ProjectWithCampaign } from '../lib/userProjects';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectWithCampaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) {
        setError('Project ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const projectData = await fetchProjectById(id);
        if (projectData) {
          setProject(projectData);
        } else {
          setError('Project not found');
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading project...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Project Not Found</h1>
            <p className="text-gray-400 mb-6">{error || 'The project you\'re looking for doesn\'t exist.'}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />
      
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 text-amber-400 hover:text-amber-300 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>

        {/* Project Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6">
            {/* Main Image */}
            <div className="lg:w-1/2 mb-6 lg:mb-0">
              <img
                src={project.image_url || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop'}
                alt={project.title}
                className="w-full h-64 lg:h-80 rounded-lg object-cover"
              />
            </div>

            {/* Project Info */}
            <div className="lg:w-1/2">
              <div className="flex items-center space-x-2 mb-4">
                <span className="bg-amber-900 text-amber-300 px-3 py-1 rounded-full text-sm">
                  {project.category}
                </span>
                <span className="bg-green-900 text-green-300 px-3 py-1 rounded-full text-sm">
                  {project.status}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{project.title}</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{project.description}</p>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="h-5 w-5 text-amber-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Impact</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{project.impact_description}</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-5 w-5 text-amber-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{project.completion_date}</p>
                </div>
              </div>

              {/* Fundraising Progress */}
              {project.fundraising_campaign && (
                <div className="mb-6">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Fundraising Progress</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        KSh {project.fundraising_campaign.raised_amount?.toLocaleString() || 0} / KSh {project.fundraising_campaign.funding_goal?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(100, ((project.fundraising_campaign.raised_amount || 0) / (project.fundraising_campaign.funding_goal || 1)) * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                  <Target className="h-4 w-4" />
                  <span>Fundraise</span>
                </button>
                <button className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors">
                  <Heart className="h-4 w-4" />
                  <span>0</span>
                </button>
                <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
                <div className="flex items-center space-x-4 text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>0</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Detailed Description */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About This Project</h2>
              <div className="prose max-w-none">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{project.description}</p>
              </div>
            </div>

            {/* Video Section */}
            {project.video_url && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Project Video</h2>
                <div className="aspect-w-16 aspect-h-9">
                  <video
                    src={project.video_url}
                    controls
                    className="w-full h-64 rounded-lg"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            )}

            {/* Gallery */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Project Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {project.image_url && (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-24 rounded-lg object-cover hover:scale-105 transition-transform cursor-pointer"
                  />
                )}
                {/* Add more gallery images here if needed */}
              </div>
            </div>

            {/* Impact Description */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Project Impact</h2>
              <div className="prose max-w-none">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{project.impact_description}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Project Details</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Category</span>
                  <p className="text-gray-900 dark:text-white">{project.category}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                  <p className="text-gray-900 dark:text-white">{project.status}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Completion Date</span>
                  <p className="text-gray-900 dark:text-white">{project.completion_date}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Created</span>
                  <p className="text-gray-900 dark:text-white">{new Date(project.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Fundraising Details */}
            {project.fundraising_campaign && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Fundraising Details</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Campaign Title</span>
                    <p className="text-gray-900 dark:text-white">{project.fundraising_campaign.title}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Funding Goal</span>
                    <p className="text-gray-900 dark:text-white">KSh {project.fundraising_campaign.funding_goal?.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Raised Amount</span>
                    <p className="text-gray-900 dark:text-white">KSh {project.fundraising_campaign.raised_amount?.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Campaign Status</span>
                    <p className="text-gray-900 dark:text-white">{project.fundraising_campaign.status}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage; 