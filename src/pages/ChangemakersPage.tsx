import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, Share2, Users, Target, TrendingUp, Lightbulb, Search, X } from 'lucide-react';
import { fetchAllPublicUsers, searchUsers, fetchUserStats, PublicUserProfile } from '../lib/userSearch';

const ChangemakersPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [changemakers, setChangemakers] = useState<PublicUserProfile[]>([]);
  const [filteredChangemakers, setFilteredChangemakers] = useState<PublicUserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  // Fetch all changemakers on component mount
  useEffect(() => {
    const fetchChangemakers = async () => {
      try {
        setLoading(true);
        const users = await fetchAllPublicUsers();
        setChangemakers(users);
        setFilteredChangemakers(users);
      } catch (error) {
        console.error('Error fetching changemakers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChangemakers();
  }, []);

  // Filter changemakers based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredChangemakers(changemakers);
      setCurrentPage(0);
      return;
    }

    const performSearch = async () => {
      try {
        const searchResults = await searchUsers(searchQuery);
        setFilteredChangemakers(searchResults);
        setCurrentPage(0);
      } catch (error) {
        console.error('Error searching changemakers:', error);
      }
    };

    performSearch();
  }, [searchQuery, changemakers]);

  const impactMetrics = [
    {
      title: '28,430',
      subtitle: 'Projects Supported',
      icon: Target,
      color: 'from-primary to-primary-dark'
    },
    {
      title: '8,470',
      subtitle: 'Youth Changemakers',
      icon: Users,
      color: 'from-secondary to-secondary-dark'
    },
    {
      title: 'KSh 180M',
      subtitle: 'Funds Raised',
      icon: TrendingUp,
      color: 'from-primary to-primary-dark'
    },
    {
      title: '412',
      subtitle: 'Innovative Solutions',
      icon: Lightbulb,
      color: 'from-secondary to-secondary-dark'
    }
  ];

  const itemsPerPage = 3;
  const totalPages = Math.ceil(filteredChangemakers.length / itemsPerPage);
  const currentChangemakers = filteredChangemakers.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  // Handle favorite toggle
  const toggleFavorite = (changemakerId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(changemakerId)) {
        newFavorites.delete(changemakerId);
      } else {
        newFavorites.add(changemakerId);
      }
      return newFavorites;
    });
  };

  // Handle share functionality
  const handleShare = (changemaker: PublicUserProfile) => {
    const shareText = `Check out ${changemaker.name}, a youth changemaker${changemaker.location ? ` from ${changemaker.location}` : ''}!`;
    const shareUrl = `${window.location.origin}/profile/${changemaker.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: `${changemaker.name} - Youth Changemaker`,
        text: shareText,
        url: shareUrl
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      alert('Profile link copied to clipboard!');
    }
  };

  // Handle explore changemakers
  const handleExploreChangemakers = () => {
    // Scroll to the featured changemakers section
    const element = document.getElementById('featured-changemakers');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading changemakers...</p>
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
      className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 relative pointer-events-auto"
    >

             {/* Impact Metrics Section */}
       <motion.section 
         id="impact-metrics"
         initial={{ opacity: 0, y: 50 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true }}
         transition={{ duration: 0.8 }}
         className="py-16 bg-white dark:bg-gray-800"
       >
         <div className="container mx-auto px-4">
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.2 }}
             className="text-center mb-12"
           >
             <h2 className="text-4xl font-bold text-gray-900 dark:text-white font-bold-rounded mb-4">Our Impact</h2>
             <p className="text-xl text-gray-600 dark:text-gray-400">Transforming communities through youth innovation</p>
           </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                         {impactMetrics.map((metric, index) => (
               <motion.div
                 key={index}
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 whileHover={{ 
                   y: -5,
                   scale: 1.05,
                   transition: { duration: 0.3 }
                 }}
                 transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                 className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-600 hover:shadow-2xl transition-all duration-300"
               >
                <div className={`w-16 h-16 bg-gradient-to-r ${metric.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <metric.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{metric.title}</div>
                <div className="text-gray-600 dark:text-gray-400">{metric.subtitle}</div>
              </motion.div>
            ))}
          </div>
        </div>
        </motion.section>

                           {/* Featured Changemakers Section */}
        <motion.section 
          id="featured-changemakers"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="py-16 bg-gray-50 dark:bg-gray-800"
        >
          <div className="container mx-auto px-4">
                        <motion.div
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.4 }}
               className="text-center mb-12"
             >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white font-bold-rounded mb-4">Featured Youth Leaders</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">Meet the young innovators driving change across Kenya</p>
              
              {/* Search Bar */}
              <div className="max-w-md mx-auto mt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search youth leaders by name, location, or area..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Search Results Indicator */}
              {searchQuery && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-xl"
                >
                                      <p className="text-primary font-medium">
                    {filteredChangemakers.length === 0 
                      ? `No results found for "${searchQuery}"`
                      : `Found ${filteredChangemakers.length} changemaker${filteredChangemakers.length === 1 ? '' : 's'} for "${searchQuery}"`
                    }
                  </p>
                </motion.div>
              )}
            </motion.div>

                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
             {currentChangemakers.length > 0 ? (
               currentChangemakers.map((changemaker, index) => (
                                   <motion.div
                    key={changemaker.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ 
                      y: -8,
                      scale: 1.02,
                      transition: { duration: 0.3 }
                    }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300"
                  >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={changemaker.avatar_url || 'https://via.placeholder.com/50'} // Fallback image
                      alt={changemaker.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{changemaker.name}</h3>
                      <p className="text-gray-600">{changemaker.location || 'Location not specified'}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="inline-block bg-primary/10 text-primary font-semibold px-3 py-1 rounded-full text-sm mb-3">
                      Youth Changemaker
                    </span>
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                      {changemaker.bio || 'No bio available yet.'}
                    </p>
                    <p className="text-[#DB5A42] font-semibold text-sm">
                      Making a difference
                    </p>
                  </div>

                  <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                    <span>0 followers</span>
                    <span>0 projects</span>
                    <span>KSh 0</span>
                  </div>

                                     <div className="flex items-center justify-between">
                     <button 
                       onClick={() => navigate(`/profile/${changemaker.id}`)}
                       className="bg-primary hover:bg-primary-dark text-black font-semibold py-2 px-4 rounded-xl transition-colors"
                     >
                       View Profile
                     </button>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => toggleFavorite(changemaker.id)}
                        className={`p-2 transition-colors ${
                          favorites.has(changemaker.id) 
                            ? 'text-red-500' 
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${favorites.has(changemaker.id) ? 'fill-current' : ''}`} />
                      </button>
                      <button 
                        onClick={() => handleShare(changemaker)}
                        className="p-2 text-gray-400 hover:text-[#00B8A9] transition-colors"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                                     </div>
                 </div>
               </motion.div>
             ))
             ) : (
               <motion.div
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.6, delay: 0.5 }}
                 className="col-span-full text-center py-12"
               >
                 <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                   <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 6.65a7.5 7.5 0 010 10.6z" />
                   </svg>
                   <h3 className="text-xl font-semibold text-gray-900 mb-2">No changemakers found</h3>
                   <p className="text-gray-600 mb-4">Try adjusting your search terms or browse all changemakers</p>
                   <button
                     onClick={() => setSearchQuery('')}
                     className="bg-primary hover:bg-primary-dark text-black font-semibold py-2 px-6 rounded-xl transition-colors"
                   >
                     Clear Search
                   </button>
                 </div>
               </motion.div>
             )}
           </div>

                     {/* Carousel Controls */}
                       {filteredChangemakers.length > 0 && totalPages > 1 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex justify-center items-center space-x-4"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevPage}
                  className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-600" />
                </motion.button>
                
                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                      onClick={() => setCurrentPage(i)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        i === currentPage ? 'bg-[#00B8A9]' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
  
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextPage}
                  className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
                >
                  <ChevronRight className="w-6 h-6 text-gray-600" />
                </motion.button>
              </motion.div>
            )}
                 </div>
        </motion.section>
     </motion.div>
   );
 };

export default ChangemakersPage; 