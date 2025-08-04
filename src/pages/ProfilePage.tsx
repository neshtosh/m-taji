import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Users, Target, TrendingUp, Heart, Share2, Mail, Phone } from 'lucide-react';
import { fetchChangemakerProfile, ChangemakerProfile } from '../lib/changemakers';

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [changemakerData, setChangemakerData] = useState<ChangemakerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError('No changemaker ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchChangemakerProfile(id);
        if (data) {
          setChangemakerData(data);
        } else {
          setError('Changemaker not found');
        }
      } catch (err) {
        console.error('Error fetching changemaker data:', err);
        setError('Failed to load changemaker profile');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleShare = () => {
    if (!changemakerData) return;
    
    const shareText = `Check out ${changemakerData.profile.name}, a youth changemaker working on ${changemakerData.area} in ${changemakerData.location}!`;
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: `${changemakerData.profile.name} - Youth Changemaker`,
        text: shareText,
        url: shareUrl
      });
    } else {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      alert('Profile link copied to clipboard!');
    }
  };

  const handleContact = () => {
    if (!changemakerData) return;
    
    // In a real app, this would open a contact form or modal
    const contactInfo = `Contact ${changemakerData.profile.name}:\n\nEmail: ${changemakerData.email}\nPhone: ${changemakerData.phone}\nWebsite: ${changemakerData.website}`;
    alert(contactInfo);
  };

  const handleFollow = () => {
    if (!changemakerData) return;
    
    // In a real app, this would add to following list
    alert(`You are now following ${changemakerData.profile.name}!`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading changemaker profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !changemakerData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'This changemaker profile could not be loaded.'}</p>
          <Link 
            to="/changemakers"
            className="inline-flex items-center text-primary hover:text-primary-dark font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Changemakers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 pt-16"
    >
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Link 
            to="/changemakers"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Changemakers
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
            >
              {/* Profile Image */}
              <div className="text-center mb-6">
                <img
                  src={changemakerData.image_url}
                  alt={changemakerData.profile.name}
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-amber-200"
                />
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{changemakerData.profile.name}</h1>
                <p className="text-gray-600 mb-2">{changemakerData.age} years old</p>
                <div className="flex items-center justify-center text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{changemakerData.location}</span>
                </div>
                <span className="inline-block bg-amber-100 text-amber-800 font-semibold px-4 py-2 rounded-full text-sm">
                  {changemakerData.area}
                </span>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                {changemakerData.email && (
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-3" />
                    <span className="text-sm">{changemakerData.email}</span>
                  </div>
                )}
                {changemakerData.phone && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-3" />
                    <span className="text-sm">{changemakerData.phone}</span>
                  </div>
                )}
                {changemakerData.website && (
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 001.414 1.414 2 2 0 002.828 0l3-3a2 2 0 000-2.828z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{changemakerData.website}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={handleContact}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
                >
                  Contact Changemaker
                </button>
                <div className="flex space-x-2">
                  <button 
                    onClick={handleFollow}
                    className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 font-semibold py-3 px-4 rounded-xl transition-colors"
                  >
                    <Heart className="w-4 h-4 mr-2 inline" />
                    Follow
                  </button>
                  <button 
                    onClick={handleShare}
                    className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-600 font-semibold py-3 px-4 rounded-xl transition-colors"
                  >
                    <Share2 className="w-4 h-4 mr-2 inline" />
                    Share
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed mb-4">{changemakerData.bio}</p>
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <h3 className="font-semibold text-amber-800 mb-2">Impact</h3>
                <p className="text-amber-700">{changemakerData.impact}</p>
              </div>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Impact Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Users className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{changemakerData.followers_count.toLocaleString()}</div>
                  <div className="text-gray-600 text-sm">Followers</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Target className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{changemakerData.projects_count}</div>
                  <div className="text-gray-600 text-sm">Projects</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <TrendingUp className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">KSh {changemakerData.funds_raised.toLocaleString()}</div>
                  <div className="text-gray-600 text-sm">Funds Raised</div>
                </div>
              </div>
            </motion.div>

            {/* Achievements Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Achievements & Awards</h2>
              <div className="space-y-3">
                {changemakerData.achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center p-3 bg-amber-50 rounded-lg">
                    <div className="w-2 h-2 bg-amber-600 rounded-full mr-3"></div>
                    <span className="text-gray-700">{achievement.title}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Current Projects Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Current Projects</h2>
              <div className="space-y-4">
                {changemakerData.projects.map((project) => (
                  <div key={project.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900">{project.name}</h3>
                      <span className="text-sm text-gray-600">{project.progress}%</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                    <div className="mb-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Target: KSh {project.target_amount.toLocaleString()}</span>
                      <span>Raised: KSh {project.raised_amount.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage; 