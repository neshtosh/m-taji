import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Calendar, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeaturedCampaigns = () => {
  const navigate = useNavigate();
  const campaigns = [
    {
      id: 1,
      title: 'Clean Water for Rural Communities',
      description: 'Providing sustainable access to clean water for 500 families in remote villages.',
      image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'Kenya, East Africa',
      raised: 75000,
      goal: 100000,
      progress: 75,
      daysLeft: 12,
      category: 'Water & Sanitation',
    },
    {
      id: 2,
      title: 'Education for Every Child',
      description: 'Building schools and providing educational resources for underprivileged children.',
      image: 'https://images.pexels.com/photos/8923181/pexels-photo-8923181.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'Uganda, East Africa',
      raised: 42000,
      goal: 60000,
      progress: 70,
      daysLeft: 25,
      category: 'Education',
    },
    {
      id: 3,
      title: 'Healthcare Mobile Clinics',
      description: 'Bringing essential medical care to remote communities through mobile health units.',
      image: 'https://images.pexels.com/photos/6647019/pexels-photo-6647019.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'Tanzania, East Africa',
      raised: 28000,
      goal: 45000,
      progress: 62,
      daysLeft: 18,
      category: 'Healthcare',
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white font-bold-rounded mb-4">
            Featured Campaigns
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover inspiring stories of hope and transformation. Your support makes these life-changing projects possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-black rounded-2xl shadow-lg overflow-hidden card-hover group cursor-pointer"
              onClick={() => navigate(`/campaign/${campaign.id}`)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={campaign.image}
                  alt={campaign.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {campaign.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-white bg-opacity-90 text-black px-3 py-1 rounded-full text-sm font-medium">
                    {campaign.daysLeft} days left
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 
                  className="text-xl font-bold text-white mb-2 group-hover:text-teal-400 transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/campaign/${campaign.id}`);
                  }}
                >
                  {campaign.title}
                </h3>
                <p className="text-gray-300 mb-4 line-clamp-2">
                  {campaign.description}
                </p>

                <div className="flex items-center text-sm text-gray-400 mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  {campaign.location}
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Progress</span>
                    <span className="text-sm font-semibold text-white">
                      {campaign.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${campaign.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      viewport={{ once: true }}
                      className="bg-teal-600 h-2 rounded-full progress-bar"
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-400">
                      ${campaign.raised.toLocaleString()} raised
                    </span>
                    <span className="text-sm font-semibold text-white">
                      ${campaign.goal.toLocaleString()} goal
                    </span>
                  </div>
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/campaign/${campaign.id}`);
                  }}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 flex items-center justify-center space-x-2 group transform hover:scale-105"
                >
                  <span>Support This Cause</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="btn-secondary">
            View All Campaigns
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCampaigns;