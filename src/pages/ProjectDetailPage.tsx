import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, Target, Award, Share2, Heart, MessageCircle, Eye } from 'lucide-react';
import DashboardHeader from '../components/dashboard/DashboardHeader';

// Mock project data - in a real app, this would come from an API
const projectData = {
  1: {
    id: 1,
    title: 'Clean Water Initiative',
    description: 'A comprehensive project aimed at providing clean water access to rural communities through sustainable water purification systems and community education programs.',
    longDescription: `The Clean Water Initiative was born from the recognition that access to clean water remains one of the most critical challenges facing rural communities in Kenya. This project implemented sustainable water purification systems while simultaneously educating communities about water hygiene and conservation practices.

Our approach involved:
• Installing solar-powered water purification units in 5 rural communities
• Training local technicians to maintain and operate the systems
• Conducting comprehensive hygiene education workshops
• Establishing community water committees for long-term sustainability

The project's success was measured not just by the number of people served, but by the lasting behavioral changes and community ownership that emerged.`,
    impact: '500+ families served',
    status: 'Completed',
    completionDate: 'January 2024',
    startDate: 'March 2023',
    location: 'Rural communities in Eastern Kenya',
    category: 'Health & Sanitation',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop'
    ],
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    team: [
      { name: 'Sarah Mwangi', role: 'Project Lead', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face' },
      { name: 'David Ochieng', role: 'Technical Coordinator', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face' },
      { name: 'Grace Wanjiku', role: 'Community Liaison', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face' }
    ],
    partners: ['UNICEF Kenya', 'Ministry of Water', 'Local Community Leaders'],
    budget: 'KSh 2,500,000',
    funding: 'Government Grant (60%), Private Donations (40%)',
    challenges: [
      'Initial resistance from some community members',
      'Logistical challenges in remote areas',
      'Weather-related delays during rainy season'
    ],
    solutions: [
      'Intensive community engagement and education',
      'Strategic partnerships with local transport companies',
      'Flexible timeline with weather contingency plans'
    ],
    outcomes: [
      '500+ families now have access to clean water',
      'Reduced waterborne diseases by 80%',
      'Established 5 community water committees',
      'Trained 15 local technicians',
      'Created sustainable maintenance protocols'
    ],
    metrics: {
      familiesServed: 500,
      communitiesReached: 5,
      techniciansTrained: 15,
      waterQualityImprovement: '95%',
      diseaseReduction: '80%'
    },
    testimonials: [
      {
        name: 'Mama Aisha',
        role: 'Community Leader',
        content: 'This project has transformed our village. Our children are healthier, and we have more time for other activities instead of walking long distances for water.',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
      },
      {
        name: 'John Kamau',
        role: 'Local Technician',
        content: 'I never thought I would be able to maintain such advanced technology. The training was excellent, and now I can help my community.',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
      }
    ],
    tags: ['Water Access', 'Community Development', 'Sustainability', 'Health', 'Education'],
    likes: 124,
    views: 2340,
    comments: 45
  },
  2: {
    id: 2,
    title: 'Digital Literacy Program',
    description: 'Teaching computer skills to youth in underserved areas to bridge the digital divide and create employment opportunities.',
    longDescription: `The Digital Literacy Program was designed to address the growing digital divide in rural and underserved urban areas. Recognizing that digital skills are increasingly essential for employment and economic participation, this project provided comprehensive computer training to young people who had limited access to technology.

The program included:
• Basic computer operations and software usage
• Internet safety and digital citizenship
• Microsoft Office suite training
• Basic programming concepts
• Online job search and application skills
• Digital entrepreneurship workshops

Each participant received a certificate upon completion and was connected with local businesses and organizations for potential employment opportunities.`,
    impact: '200+ students trained',
    status: 'Completed',
    completionDate: 'December 2023',
    startDate: 'September 2023',
    location: 'Nairobi and surrounding counties',
    category: 'Education',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=300&fit=crop'
    ],
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    team: [
      { name: 'Michael Ochieng', role: 'Program Director', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face' },
      { name: 'Faith Wanjiru', role: 'Lead Instructor', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face' },
      { name: 'James Muthoni', role: 'Technical Support', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face' }
    ],
    partners: ['Microsoft Kenya', 'Local Schools', 'Community Centers'],
    budget: 'KSh 1,800,000',
    funding: 'Corporate Sponsorship (70%), Government Support (30%)',
    challenges: [
      'Limited access to computers in some areas',
      'Varying levels of prior knowledge among students',
      'Scheduling conflicts with school and work'
    ],
    solutions: [
      'Mobile computer labs that traveled to different locations',
      'Adaptive curriculum with multiple skill levels',
      'Flexible scheduling with evening and weekend classes'
    ],
    outcomes: [
      '200+ students completed the program',
      '85% of graduates found employment within 6 months',
      'Established 3 permanent computer labs',
      'Created ongoing mentorship program',
      'Developed curriculum for future programs'
    ],
    metrics: {
      studentsTrained: 200,
      employmentRate: '85%',
      computerLabsEstablished: 3,
      averageSalaryIncrease: '40%',
      programSatisfaction: '92%'
    },
    testimonials: [
      {
        name: 'Lucy Wambui',
        role: 'Program Graduate',
        content: 'This program changed my life. I went from having never touched a computer to getting a job as a data entry clerk. I can now support my family.',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
      },
      {
        name: 'Peter Njoroge',
        role: 'Employer',
        content: 'We hired three graduates from this program. Their skills are excellent, and they bring a great work ethic. We plan to hire more.',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
      }
    ],
    tags: ['Digital Skills', 'Youth Employment', 'Technology', 'Education', 'Economic Development'],
    likes: 89,
    views: 1567,
    comments: 32
  }
};

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = id ? projectData[id as unknown as keyof typeof projectData] : null;

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Project Not Found</h1>
            <p className="text-gray-400 mb-6">The project you're looking for doesn't exist.</p>
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
                src={project.image}
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
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{project.impact}</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-5 w-5 text-amber-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{project.completionDate}</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center space-x-2 mb-6">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">{project.location}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                  <Target className="h-4 w-4" />
                  <span>Fundraise</span>
                </button>
                <button className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors">
                  <Heart className="h-4 w-4" />
                  <span>{project.likes}</span>
                </button>
                <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
                <div className="flex items-center space-x-4 text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{project.views}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{project.comments}</span>
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
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{project.longDescription}</p>
              </div>
            </div>

            {/* Video Section */}
            {project.video && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Project Video</h2>
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src={project.video}
                    title={project.title}
                    className="w-full h-64 rounded-lg"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            {/* Gallery */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Project Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {project.gallery.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${project.title} - Image ${index + 1}`}
                    className="w-full h-24 rounded-lg object-cover hover:scale-105 transition-transform cursor-pointer"
                  />
                ))}
              </div>
            </div>

            {/* Outcomes */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Key Outcomes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.outcomes.map((outcome, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-600 dark:text-gray-300">{outcome}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">What People Say</h2>
              <div className="space-y-4">
                {project.testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                          <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">{testimonial.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Team */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Project Team</h3>
              <div className="space-y-3">
                {project.team.map((member, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Project Details</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Start Date</span>
                  <p className="text-gray-900 dark:text-white">{project.startDate}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Completion Date</span>
                  <p className="text-gray-900 dark:text-white">{project.completionDate}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Budget</span>
                  <p className="text-gray-900 dark:text-white">{project.budget}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Funding Sources</span>
                  <p className="text-gray-900 dark:text-white">{project.funding}</p>
                </div>
              </div>
            </div>

            {/* Partners */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Partners</h3>
              <div className="space-y-2">
                {project.partners.map((partner, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-300">{partner}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Challenges & Solutions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Challenges & Solutions</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Challenges Faced</h4>
                  <div className="space-y-2">
                    {project.challenges.map((challenge, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{challenge}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Solutions Implemented</h4>
                  <div className="space-y-2">
                    {project.solutions.map((solution, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{solution}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Key Metrics</h3>
              <div className="space-y-3">
                {Object.entries(project.metrics).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage; 