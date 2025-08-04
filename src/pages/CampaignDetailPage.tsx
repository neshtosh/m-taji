import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  Heart, 
  Share2,
  DollarSign,
  Clock,
  CheckCircle
} from 'lucide-react';
import DonationModal from '../components/ui/DonationModal';

const CampaignDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDonationModal, setShowDonationModal] = useState(false);

  // Campaign data - this would typically come from an API
  const campaignData = {
    1: {
      id: 1,
      title: 'Clean Water for Rural Communities',
      description: 'Providing sustainable access to clean water for 500 families in remote villages.',
      longDescription: 'This comprehensive project aims to provide clean, safe drinking water to 500 families across 10 rural communities in Kenya. The initiative includes drilling boreholes, installing water purification systems, and training local communities in water management and maintenance.',
      image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'Kenya, East Africa',
      raised: 75000,
      goal: 100000,
      progress: 75,
      daysLeft: 12,
      category: 'Water & Sanitation',
      startDate: 'March 15, 2024',
      completionDate: 'December 2024',
      impact: '500 families will have access to clean water',
      team: [
        { name: 'Sarah Mwangi', role: 'Project Manager', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150' },
        { name: 'David Ochieng', role: 'Water Engineer', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150' },
        { name: 'Grace Wanjiku', role: 'Community Coordinator', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150' }
      ],
      updates: [
        { date: '2024-03-15', title: 'Project Launch', content: 'Successfully launched the clean water initiative with community leaders.' },
        { date: '2024-04-01', title: 'Site Survey Complete', content: 'Completed comprehensive survey of all 10 target communities.' },
        { date: '2024-04-15', title: 'First Borehole Drilled', content: 'Successfully drilled the first borehole in Mwala village.' }
      ],
      gallery: [
        'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/6647019/pexels-photo-6647019.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/6647020/pexels-photo-6647020.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]
    },
    2: {
      id: 2,
      title: 'Education for Every Child',
      description: 'Building schools and providing educational resources for underprivileged children.',
      longDescription: 'This transformative project focuses on building quality educational infrastructure and providing comprehensive learning resources for children in underserved communities across Uganda. The initiative includes constructing modern classrooms, providing textbooks and digital learning tools, and training local teachers.',
      image: 'https://images.pexels.com/photos/8923181/pexels-photo-8923181.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'Uganda, East Africa',
      raised: 42000,
      goal: 60000,
      progress: 70,
      daysLeft: 25,
      category: 'Education',
      startDate: 'February 1, 2024',
      completionDate: 'November 2024',
      impact: '1,200 children will receive quality education',
      team: [
        { name: 'John Okello', role: 'Education Director', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150' },
        { name: 'Mary Nakato', role: 'Curriculum Specialist', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150' },
        { name: 'Peter Ssewanyana', role: 'Construction Manager', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150' }
      ],
      updates: [
        { date: '2024-02-01', title: 'Project Initiation', content: 'Launched the education initiative with local government support.' },
        { date: '2024-03-01', title: 'Site Preparation', content: 'Completed site preparation and foundation work for the first school.' },
        { date: '2024-04-01', title: 'Construction Begins', content: 'Started construction of the first classroom block.' }
      ],
      gallery: [
        'https://images.pexels.com/photos/8923181/pexels-photo-8923181.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/8923182/pexels-photo-8923182.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/8923183/pexels-photo-8923183.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]
    },
    3: {
      id: 3,
      title: 'Healthcare Mobile Clinics',
      description: 'Bringing essential medical care to remote communities through mobile health units.',
      longDescription: 'This innovative healthcare project deploys mobile medical clinics to provide essential healthcare services to remote communities in Tanzania. The initiative includes preventive care, maternal health services, child vaccinations, and emergency medical response.',
      image: 'https://images.pexels.com/photos/6647019/pexels-photo-6647019.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'Tanzania, East Africa',
      raised: 28000,
      goal: 45000,
      progress: 62,
      daysLeft: 18,
      category: 'Healthcare',
      startDate: 'January 15, 2024',
      completionDate: 'October 2024',
      impact: '2,000+ people will receive healthcare services',
      team: [
        { name: 'Dr. Amina Hassan', role: 'Medical Director', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150' },
        { name: 'Dr. Mwambu Kiprop', role: 'Public Health Specialist', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150' },
        { name: 'Nurse Sarah Kimani', role: 'Community Health Nurse', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150' }
      ],
      updates: [
        { date: '2024-01-15', title: 'Project Launch', content: 'Successfully launched mobile healthcare initiative in rural Tanzania.' },
        { date: '2024-02-15', title: 'First Mobile Clinic', content: 'Deployed first mobile clinic to serve 3 remote villages.' },
        { date: '2024-03-15', title: 'Vaccination Drive', content: 'Completed vaccination drive for 500 children under 5 years.' }
      ],
      gallery: [
        'https://images.pexels.com/photos/6647019/pexels-photo-6647019.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/6647020/pexels-photo-6647020.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/6647021/pexels-photo-6647021.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]
    }
  };

  const campaign = id ? campaignData[id as '1' | '2' | '3'] : null;

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Campaign Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">The campaign you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-primary hover:bg-primary-dark text-black px-6 py-2 rounded-lg transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-primary hover:text-primary-dark mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </button>

        {/* Campaign Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6">
            {/* Main Image */}
            <div className="lg:w-1/2 mb-6 lg:mb-0">
              <img
                src={campaign.image}
                alt={campaign.title}
                className="w-full h-64 lg:h-80 rounded-lg object-cover"
              />
            </div>

            {/* Campaign Info */}
            <div className="lg:w-1/2">
              <div className="flex items-center space-x-2 mb-4">
                <span className="bg-primary text-black px-3 py-1 rounded-full text-sm font-medium">
                  {campaign.category}
                </span>
                <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
                  Active
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{campaign.title}</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{campaign.description}</p>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {campaign.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-primary h-3 rounded-full transition-all duration-500"
                    style={{ width: `${campaign.progress}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ${campaign.raised.toLocaleString()} raised
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    ${campaign.goal.toLocaleString()} goal
                  </span>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Impact</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{campaign.impact}</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Days Left</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{campaign.daysLeft}</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center space-x-2 mb-6">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">{campaign.location}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setShowDonationModal(true)}
                  className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-black px-6 py-3 rounded-lg transition-colors font-semibold"
                >
                  <DollarSign className="h-5 w-5" />
                  <span>Donate Now</span>
                </button>
                <button className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg transition-colors">
                  <Heart className="h-5 w-5" />
                  <span>Follow</span>
                </button>
                <button className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg transition-colors">
                  <Share2 className="h-5 w-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Detailed Description */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About This Campaign</h2>
              <div className="prose max-w-none">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{campaign.longDescription}</p>
              </div>
            </div>

            {/* Gallery */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Campaign Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {campaign.gallery.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${campaign.title} - Image ${index + 1}`}
                    className="w-full h-24 rounded-lg object-cover hover:scale-105 transition-transform cursor-pointer"
                  />
                ))}
              </div>
            </div>

            {/* Updates */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Updates</h2>
              <div className="space-y-4">
                {campaign.updates.map((update, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{update.title}</h4>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{update.date}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{update.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Campaign Team */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Campaign Team</h3>
              <div className="space-y-3">
                {campaign.team.map((member, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Campaign Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Campaign Details</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Start Date</span>
                  <p className="text-gray-900 dark:text-white">{campaign.startDate}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Expected Completion</span>
                  <p className="text-gray-900 dark:text-white">{campaign.completionDate}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Category</span>
                  <p className="text-gray-900 dark:text-white">{campaign.category}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Location</span>
                  <p className="text-gray-900 dark:text-white">{campaign.location}</p>
                </div>
              </div>
            </div>

            {/* Donation Form */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Make a Donation</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <button className="bg-primary hover:bg-primary-dark text-black font-semibold py-3 px-4 rounded-lg transition-colors">
                    $25
                  </button>
                  <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-4 rounded-lg transition-colors">
                    $50
                  </button>
                  <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-4 rounded-lg transition-colors">
                    $100
                  </button>
                  <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-4 rounded-lg transition-colors">
                    $250
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Custom Amount
                  </label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <button 
                  onClick={() => setShowDonationModal(true)}
                  className="w-full bg-primary hover:bg-primary-dark text-black font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Donate Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DonationModal isOpen={showDonationModal} onClose={() => setShowDonationModal(false)} />
    </div>
  );
};

export default CampaignDetailPage; 