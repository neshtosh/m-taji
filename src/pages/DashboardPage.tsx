import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { 
  Users, 
  Target, 
  TrendingUp, 
  Award, 
  Calendar, 
  MapPin, 
  Eye, 
  Heart, 
  MessageCircle,
  Plus,
  Upload,
  FileText,
  Image,
  Video,
  Link as LinkIcon,
  Share2
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;

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

  const completedProjects = [
    {
      id: 1,
      title: 'Clean Water Initiative',
      description: 'Providing clean water access to rural communities',
      impact: '500+ families served',
      status: 'Completed',
      date: '2024-01-15',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      title: 'Digital Literacy Program',
      description: 'Teaching computer skills to youth in underserved areas',
      impact: '200+ students trained',
      status: 'In Progress',
      date: '2024-02-20',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop'
    }
  ];

  const projectsDone = [
    {
      id: 1,
      title: 'Clean Water Initiative',
      description: 'Provided clean water access to rural communities',
      impact: '500+ families served',
      completionDate: 'January 2024',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      category: 'Health & Sanitation'
    },
    {
      id: 2,
      title: 'Digital Literacy Program',
      description: 'Taught computer skills to youth in underserved areas',
      impact: '200+ students trained',
      completionDate: 'December 2023',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
      category: 'Education'
    },
    {
      id: 3,
      title: 'Community Garden Project',
      description: 'Established sustainable farming practices in urban areas',
      impact: '150+ households benefited',
      completionDate: 'November 2023',
      image: 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=400&h=300&fit=crop',
      category: 'Agriculture'
    },
    {
      id: 4,
      title: 'Youth Mentorship Program',
      description: 'Connected young professionals with high school students',
      impact: '75+ students mentored',
      completionDate: 'October 2023',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
      category: 'Education'
    },
    {
      id: 5,
      title: 'Renewable Energy Workshop',
      description: 'Trained communities on solar panel installation',
      impact: '300+ people trained',
      completionDate: 'September 2023',
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop',
      category: 'Environment'
    },
    {
      id: 6,
      title: 'Women Empowerment Initiative',
      description: 'Provided business skills training to women entrepreneurs',
      impact: '120+ women empowered',
      completionDate: 'August 2023',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=300&fit=crop',
      category: 'Economic Development'
    }
  ];

  const renderProfileContent = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Profile Overview */}
      <div className="lg:col-span-1">
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                              <span className="text-gray-900 dark:text-white font-bold text-2xl">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h3>
            <p className="text-gray-600 dark:text-gray-400">Youth Changemaker</p>
            <p className="text-sm text-gray-500 mt-1">Member since 2023</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Location</span>
              <span className="font-medium text-gray-700 dark:text-white">Nairobi, Kenya</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Focus Area</span>
              <span className="font-medium text-gray-700 dark:text-white">Education & Technology</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Projects Completed</span>
              <span className="font-medium text-green-400">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Total Impact</span>
              <span className="font-medium text-orange-400">2,500+ lives</span>
            </div>
          </div>

          <button className="w-full mt-6 bg-primary hover:bg-primary-dark text-black font-semibold py-2 px-4 rounded-lg transition-colors">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Projects Done */}
      <div className="lg:col-span-2 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Projects Done</h3>
            <span className="text-sm text-gray-400">{projectsDone.length} completed projects</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectsDone.slice(0, 4).map((project) => (
              <div key={project.id} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <div className="flex items-start space-x-3">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{project.title}</h4>
                    <p className="text-xs text-gray-400 mb-2 line-clamp-2">{project.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-amber-900 text-amber-300 px-2 py-1 rounded-full">
                        {project.category}
                      </span>
                      <span className="text-xs text-gray-500">{project.completionDate}</span>
                    </div>
                    <p className="text-xs text-green-400 mt-1">{project.impact}</p>
                    <div className="flex space-x-2 mt-2">
                      <button className="text-xs text-blue-400 hover:text-blue-300 font-medium">Fundraise</button>
                      <button className="text-xs text-gray-400 hover:text-gray-300">View</button>
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
                className="text-primary hover:text-primary-dark text-sm font-medium transition-colors"
              >
                View All {projectsDone.length} Projects
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {completedProjects.map((project) => (
              <div key={project.id} className="flex items-center space-x-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{project.title}</h4>
                  <p className="text-sm text-gray-400">{project.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded-full">
                      {project.status}
                    </span>
                    <span className="text-xs text-gray-500">{project.impact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProjectsContent = () => {
    // Calculate pagination
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = projectsDone.slice(indexOfFirstProject, indexOfLastProject);
    const totalPages = Math.ceil(projectsDone.length / projectsPerPage);

    return (
      <div className="space-y-6">
        {/* Upload New Project Form - At the top */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
                          <h3 className="text-xl font-bold text-gray-900 font-artistic italic">Upload New Project</h3>
            <span className="text-sm text-gray-500">Share your latest project</span>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Enter project title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                  <option value="">Select category</option>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                rows={3}
                placeholder="Describe your project and its impact..."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Images</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload images</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Video</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Video className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload video</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Impact Description</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="e.g., 500+ families served"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Completion Date</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Fundraising Options */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-3 mb-3">
                <input 
                  type="checkbox" 
                  id="fundraise-project"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="fundraise-project" className="text-sm font-medium text-blue-900">
                  Enable Fundraising for this Project
                </label>
              </div>
              <p className="text-xs text-blue-700 mb-3">
                Allow supporters to contribute financially to help scale this project and create greater impact.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-blue-800 mb-1">Funding Goal (KSh)</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="e.g., 500,000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-blue-800 mb-1">Campaign Duration (Days)</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="e.g., 30"
                  />
                </div>
              </div>
            </div>
            
            <button className="w-full bg-primary hover:bg-primary-dark text-black font-semibold py-3 px-4 rounded-lg transition-colors">
              Upload Project
            </button>
          </div>
        </div>

        {/* All Projects Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 font-artistic italic">My Projects</h3>
              <p className="text-sm text-gray-500 mt-1">Showing {projectsDone.length} completed projects</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Filter:</span>
              <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
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

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {currentProjects.map((project) => (
              <div key={project.id} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                      {project.category}
                    </span>
                    <span className="text-xs text-gray-500">{project.completionDate}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{project.title}</h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-600 font-medium">{project.impact}</span>
                    <div className="flex space-x-2">
                      <button className="text-xs text-amber-600 hover:text-amber-700 font-medium">Edit</button>
                      <button 
                        onClick={() => navigate(`/project/${project.id}`)}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        View
                      </button>
                      <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">Fundraise</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 pt-6">
              <div className="text-sm text-gray-500">
                Showing {indexOfFirstProject + 1} to {Math.min(indexOfLastProject, projectsDone.length)} of {projectsDone.length} projects
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              rows={3}
              placeholder="What's on your mind? Share your thoughts, updates, or inspiration..."
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button className="p-2 text-gray-500 hover:text-amber-600 transition-colors">
              <Image className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-amber-600 transition-colors">
              <Video className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-amber-600 transition-colors">
              <LinkIcon className="h-5 w-5" />
            </button>
          </div>
          <button className="bg-primary hover:bg-primary-dark text-black font-semibold px-4 py-2 rounded-lg transition-colors">
            Post
          </button>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="space-y-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" 
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h4 className="font-semibold text-gray-900">Just completed our water purification project! 🚰</h4>
              <p className="text-sm text-gray-500">2 hours ago</p>
            </div>
          </div>
          <p className="text-gray-700 mb-3">
            Excited to share that we've successfully provided clean water access to 500+ families in rural communities. 
            The impact has been incredible - children are healthier, and families have more time for education and work.
          </p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <button className="flex items-center space-x-1 hover:text-amber-600 transition-colors">
              <Heart className="h-4 w-4" />
              <span>24</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-amber-600 transition-colors">
              <MessageCircle className="h-4 w-4" />
              <span>8</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-amber-600 transition-colors">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBlogContent = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 font-artistic italic">My Blog Posts</h3>
        <button className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-black font-semibold px-4 py-2 rounded-lg transition-colors">
          <Plus className="h-4 w-4" />
          <span>Write Blog</span>
        </button>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link to="/blog/1" className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
          <img 
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop" 
            alt="Blog post"
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h4 className="font-semibold text-gray-900 mb-2">The Future of Digital Education</h4>
            <p className="text-sm text-gray-600 mb-3">Exploring innovative approaches to bridge the digital divide in rural communities...</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>March 15, 2024</span>
              <span>1.2K views</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Write New Blog */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Write New Blog Post</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Blog Title</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Enter blog title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Image className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Click to upload featured image</p>
            </div>
          </div>
          
          {/* Rich Text Editor Toolbar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              {/* Editor Toolbar */}
              <div className="bg-gray-100 border-b border-gray-300 p-2 flex flex-wrap items-center gap-1">
                {/* Font Family */}
                <select className="px-2 py-1 text-sm border border-gray-300 rounded bg-white">
                  <option value="sans">Sans Serif</option>
                  <option value="serif">Serif</option>
                  <option value="mono">Monospace</option>
                </select>
                
                {/* Font Size */}
                <select className="px-2 py-1 text-sm border border-gray-300 rounded bg-white">
                  <option value="12">12px</option>
                  <option value="14">14px</option>
                  <option value="16" selected>16px</option>
                  <option value="18">18px</option>
                  <option value="20">20px</option>
                  <option value="24">24px</option>
                  <option value="32">32px</option>
                </select>
                
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                
                {/* Text Formatting */}
                <button className="p-1 hover:bg-gray-200 rounded" title="Bold">
                  <span className="font-bold text-sm">B</span>
                </button>
                <button className="p-1 hover:bg-gray-200 rounded" title="Italic">
                  <span className="italic text-sm">I</span>
                </button>
                <button className="p-1 hover:bg-gray-200 rounded" title="Underline">
                  <span className="underline text-sm">U</span>
                </button>
                <button className="p-1 hover:bg-gray-200 rounded" title="Strikethrough">
                  <span className="line-through text-sm">S</span>
                </button>
                
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                
                {/* Text Alignment */}
                <button className="p-1 hover:bg-gray-200 rounded" title="Align Left">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                  </svg>
                </button>
                <button className="p-1 hover:bg-gray-200 rounded" title="Align Center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z"/>
                  </svg>
                </button>
                <button className="p-1 hover:bg-gray-200 rounded" title="Align Right">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                  </svg>
                </button>
                
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                
                {/* Text Color */}
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-600">Color:</span>
                  <input type="color" className="w-6 h-6 border border-gray-300 rounded cursor-pointer" />
                </div>
                
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                
                {/* Lists */}
                <button className="p-1 hover:bg-gray-200 rounded" title="Bullet List">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z"/>
                  </svg>
                </button>
                <button className="p-1 hover:bg-gray-200 rounded" title="Numbered List">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z"/>
                  </svg>
                </button>
                
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                
                {/* Links and Media */}
                <button className="p-1 hover:bg-gray-200 rounded" title="Insert Link">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 01-1.414-1.414 1 1 0 011.414-1.414l3-3z" clipRule="evenodd"/>
                    <path fillRule="evenodd" d="M11.586 7.586a2 2 0 012.828 0l3 3a2 2 0 01-2.828 2.828l-3-3a2 2 0 010-2.828z" clipRule="evenodd"/>
                  </svg>
                </button>
                <button className="p-1 hover:bg-gray-200 rounded" title="Insert Image">
                  <Image className="w-4 h-4" />
                </button>
                <button className="p-1 hover:bg-gray-200 rounded" title="Insert Video">
                  <Video className="w-4 h-4" />
                </button>
              </div>
              
              {/* Editor Content Area */}
              <div className="p-4 bg-white">
                <div 
                  contentEditable
                  className="min-h-64 outline-none focus:ring-0 prose prose-lg max-w-none"
                  style={{ 
                    fontFamily: 'inherit',
                    fontSize: '16px',
                    lineHeight: '1.6'
                  }}
                >
                  <p>Start writing your blog post here...</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-gray-600">Save as draft</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-gray-600">Schedule for later</span>
              </label>
            </div>
            <div className="flex space-x-2">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Save Draft
              </button>
              <button className="px-4 py-2 bg-primary hover:bg-primary-dark text-black font-semibold rounded-lg transition-colors">
                Publish Blog
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderShopContent = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Your Products - Left Column */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 font-artistic italic">Your Products</h3>
            <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
              <Plus className="h-4 w-4" />
              <span>Add Product</span>
            </button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Card 1 */}
            <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Image className="h-8 w-8 text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-500">Product Image</p>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2">M-TAJI Eco T-Shirt</h4>
                <p className="text-lg font-bold text-gray-900 mb-2">KSh 1,500</p>
                <p className="text-sm text-green-600 mb-4">45 sold this month</p>
                <div className="flex space-x-2">
                  <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    Edit
                  </button>
                  <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    View
                  </button>
                </div>
              </div>
            </div>

            {/* Product Card 2 */}
            <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Image className="h-8 w-8 text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-500">Product Image</p>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Sustainability Mug</h4>
                <p className="text-lg font-bold text-gray-900 mb-2">KSh 800</p>
                <p className="text-sm text-green-600 mb-4">32 sold this month</p>
                <div className="flex space-x-2">
                  <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    Edit
                  </button>
                  <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Add Product Form */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-4">Add New Product</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (KSh)</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe your product"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload product images</p>
                </div>
              </div>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                Add Product
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Sales Summary & Quick Actions */}
      <div className="space-y-6">
        {/* Sales Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Sales Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Revenue</span>
              <span className="text-xl font-bold text-gray-900">KSh 42,500</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Items Sold</span>
              <span className="text-xl font-bold text-gray-900">77 Items Sold</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Rating</span>
              <span className="text-xl font-bold text-gray-900">4.8★ Average Rating</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors">
              <Plus className="h-5 w-5" />
              <span>Add Product</span>
            </button>
            <button className="w-full flex items-center space-x-3 border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              <TrendingUp className="h-5 w-5" />
              <span>View Analytics</span>
            </button>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Eco T-Shirt</p>
                <p className="text-sm text-gray-500">Order #1234</p>
              </div>
              <span className="text-green-600 font-medium">KSh 1,500</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Sustainability Mug</p>
                <p className="text-sm text-gray-500">Order #1235</p>
              </div>
              <span className="text-green-600 font-medium">KSh 800</span>
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Mobile Navigation Tabs - Only visible on mobile */}
      <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-primary text-black font-semibold'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Dashboard Title - Only show on profile page */}
        {activeTab === 'profile' && (
          <>
            <div className="mb-8">
                              <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-artistic italic mb-2">Your Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage your profile, projects, and community engagement</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {metrics.map((metric) => (
                                 <div key={metric.name} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                   <div className="flex items-center justify-between">
                     <div>
                       <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.name}</p>
                       <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
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
        <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-black font-semibold'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default DashboardPage; 