import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, Share2, Users, Target, TrendingUp, Lightbulb, Search, X } from 'lucide-react';
import { fetchAllPublicUsers, searchUsers, fetchUserStats, PublicUserProfile, testDatabaseConnection } from '../lib/userSearch';
import { toggleFollow, getUserFollowStats, ensureFollowersTable, getFollowersList, getFollowingList } from '../lib/followers';
import { useAuth } from '../context/AuthContext';

const ChangemakersPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [changemakers, setChangemakers] = useState<PublicUserProfile[]>([]);
  const [filteredChangemakers, setFilteredChangemakers] = useState<PublicUserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [userStats, setUserStats] = useState<{[key: string]: any}>({});
  const [followStats, setFollowStats] = useState<{[key: string]: any}>({});
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [followersList, setFollowersList] = useState<any[]>([]);
  const [followingList, setFollowingList] = useState<any[]>([]);
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const [loadingFollowing, setLoadingFollowing] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  // Handle URL search parameters
  useEffect(() => {
    const urlSearchQuery = searchParams.get('search');
    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery);
    }
  }, [searchParams]);

  // Fetch all changemakers and their stats on component mount
  useEffect(() => {
    const fetchChangemakers = async () => {
      try {
        setLoading(true);
        
        // Test database connection first
        await testDatabaseConnection();
        
        const users = await fetchAllPublicUsers();
        setChangemakers(users);
        setFilteredChangemakers(users);

        // Fetch stats for each user
        const statsPromises = users.map(async (user) => {
          const stats = await fetchUserStats(user.id);
          return { [user.id]: stats };
        });

        // Fetch follow stats for each user
        const followStatsPromises = users.map(async (user) => {
          const followStats = await getUserFollowStats(user.id, user?.id);
          return { [user.id]: followStats };
        });

        const [statsResults, followStatsResults] = await Promise.all([
          Promise.all(statsPromises),
          Promise.all(followStatsPromises)
        ]);
        
        const combinedStats = statsResults.reduce((acc, stat) => ({ ...acc, ...stat }), {});
        const combinedFollowStats = followStatsResults.reduce((acc, stat) => ({ ...acc, ...stat }), {});
        
        setUserStats(combinedStats);
        setFollowStats(combinedFollowStats);
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

  // Handle follow functionality
  const handleFollow = async (changemakerId: string) => {
    if (!user) {
      alert('Please sign in to follow changemakers');
      return;
    }

    try {
      const result = await toggleFollow(user.id, changemakerId);
      if (result.success) {
        // Update the follow stats locally
        setFollowStats(prev => ({
          ...prev,
          [changemakerId]: {
            ...prev[changemakerId],
            is_following: result.isFollowing,
            followers_count: result.isFollowing 
              ? (prev[changemakerId]?.followers_count || 0) + 1
              : Math.max((prev[changemakerId]?.followers_count || 0) - 1, 0)
          }
        }));
      } else {
        alert('Failed to update follow status. Please try again.');
      }
    } catch (error) {
      console.error('Error following user:', error);
      alert('Failed to update follow status. Please try again.');
    }
  };

  const handleShowFollowers = async (changemaker: PublicUserProfile) => {
    setSelectedUser(changemaker);
    setLoadingFollowers(true);
    setShowFollowersModal(true);
    
    try {
      const followers = await getFollowersList(changemaker.id);
      setFollowersList(followers);
    } catch (error) {
      console.error('Error fetching followers:', error);
    } finally {
      setLoadingFollowers(false);
    }
  };

  const handleShowFollowing = async (changemaker: PublicUserProfile) => {
    setSelectedUser(changemaker);
    setLoadingFollowing(true);
    setShowFollowingModal(true);
    
    try {
      const following = await getFollowingList(changemaker.id);
      setFollowingList(following);
    } catch (error) {
      console.error('Error fetching following:', error);
    } finally {
      setLoadingFollowing(false);
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
             <h1 className="text-4xl md:text-6xl font-bold font-bold-rounded mb-6 text-primary">Our Impact</h1>
             <p className="text-xl text-gray-600 dark:text-gray-400">Transforming communities through youth innovation</p>
           </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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

                     <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
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
                    <button 
                      onClick={() => handleShowFollowers(changemaker)}
                      className="hover:text-teal-600 transition-colors cursor-pointer"
                    >
                      {followStats[changemaker.id]?.followers_count || 0} followers
                    </button>
                    <span>{userStats[changemaker.id]?.projects || 0} projects</span>
                    <span>{userStats[changemaker.id]?.blogs || 0} blogs</span>
                  </div>

                                     <div className="flex items-center justify-between">
                     <button 
                       onClick={() => navigate(`/profile/${changemaker.id}`)}
                       className="bg-primary hover:bg-primary-dark text-black font-semibold py-2 px-4 rounded-xl transition-colors"
                     >
                       View Profile
                     </button>
                    <div className="flex space-x-2">
                      {user && user.id !== changemaker.id && (
                        <button 
                          onClick={() => handleFollow(changemaker.id)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            followStats[changemaker.id]?.is_following
                              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              : 'bg-teal-600 text-white hover:bg-teal-700'
                          }`}
                        >
                          {followStats[changemaker.id]?.is_following ? 'Following' : 'Follow'}
                        </button>
                      )}
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

        {/* Followers Modal */}
        {showFollowersModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedUser.name}'s Followers
                  </h3>
                  <button
                    onClick={() => setShowFollowersModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {loadingFollowers ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading followers...</p>
                  </div>
                ) : followersList.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Followers Yet</h3>
                    <p className="text-gray-600">This changemaker doesn't have any followers yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {followersList.map((follower) => (
                      <div key={follower.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {follower.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{follower.name}</h4>
                          <p className="text-sm text-gray-600">{follower.email}</p>
                        </div>
                        <Link
                          to={`/profile/${follower.id}`}
                          className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                        >
                          View Profile
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Following Modal */}
        {showFollowingModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedUser.name}'s Following
                  </h3>
                  <button
                    onClick={() => setShowFollowingModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {loadingFollowing ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading following...</p>
                  </div>
                ) : followingList.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Not Following Anyone</h3>
                    <p className="text-gray-600">This changemaker isn't following anyone yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {followingList.map((following) => (
                      <div key={following.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {following.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{following.name}</h4>
                          <p className="text-sm text-gray-600">{following.email}</p>
                        </div>
                        <Link
                          to={`/profile/${following.id}`}
                          className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                        >
                          View Profile
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
     </motion.div>
   );
 };

export default ChangemakersPage; 