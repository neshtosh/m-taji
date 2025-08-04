import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, Share2, Users, Target, TrendingUp, Lightbulb, Search, X } from 'lucide-react';

// Move featuredChangemakers outside the component to prevent recreation on every render
const featuredChangemakers = [
  {
    id: 1,
    name: 'Wanjiku Maina',
    age: 24,
    location: 'Nairobi',
    area: 'Climate Action & Renewable Energy',
    bio: 'Passionate environmental advocate working to bring clean energy solutions to rural communities. Leading innovative solar projects that transform lives.',
    impact: '500+ families with clean energy',
    followers: 2400,
    projects: 3,
    fundsRaised: 'KSh 450K',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face'
  },
  {
    id: 2,
    name: 'Brian Kipkoech',
    age: 22,
    location: 'Eldoret',
    area: 'Youth Empowerment & Agriculture',
    bio: 'Empowering young farmers with modern agricultural techniques and sustainable farming practices. Building a future where agriculture thrives.',
    impact: '200+ youth employed',
    followers: 1800,
    projects: 5,
    fundsRaised: 'KSh 320K',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face'
  },
  {
    id: 3,
    name: 'Amina Hassan',
    age: 26,
    location: 'Mombasa',
    area: 'Education & Digital Literacy',
    bio: 'Bridging the digital divide by providing technology education to underserved communities. Creating opportunities through digital skills training.',
    impact: '1,000+ students trained',
    followers: 3200,
    projects: 4,
    fundsRaised: 'KSh 680K',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face'
  },
  {
    id: 4,
    name: 'David Ochieng',
    age: 23,
    location: 'Kisumu',
    area: 'Water & Sanitation',
    bio: 'Developing innovative water purification systems for rural communities. Ensuring access to clean water for all.',
    impact: '300+ communities served',
    followers: 2100,
    projects: 6,
    fundsRaised: 'KSh 520K',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face'
  },
  {
    id: 5,
    name: 'Sarah Njeri',
    age: 25,
    location: 'Nakuru',
    area: 'Waste Management & Recycling',
    bio: 'Transforming waste into wealth through innovative recycling programs. Creating sustainable solutions for environmental challenges.',
    impact: '15,000+ kg waste recycled',
    followers: 1900,
    projects: 4,
    fundsRaised: 'KSh 380K',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face'
  },
  {
    id: 6,
    name: 'James Mwangi',
    age: 21,
    location: 'Thika',
    area: 'Healthcare Innovation',
    bio: 'Developing affordable healthcare solutions for rural communities. Using technology to bridge healthcare gaps.',
    impact: '2,000+ patients served',
    followers: 2800,
    projects: 3,
    fundsRaised: 'KSh 420K',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face'
  }
];

const ChangemakersPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredChangemakers, setFilteredChangemakers] = useState<typeof featuredChangemakers>(featuredChangemakers);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

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

  // Filter changemakers based on search query
  React.useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredChangemakers(featuredChangemakers);
      setCurrentPage(0);
      return;
    }

    const filtered = featuredChangemakers.filter((changemaker) => {
      const query = searchQuery.toLowerCase();
      return (
        changemaker.name.toLowerCase().includes(query) ||
        changemaker.location.toLowerCase().includes(query) ||
        changemaker.area.toLowerCase().includes(query) ||
        changemaker.bio.toLowerCase().includes(query)
      );
    });

    setFilteredChangemakers(filtered);
    setCurrentPage(0); // Reset to first page when filtering
  }, [searchQuery]); // Remove featuredChangemakers from dependency array since it's now static

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
  const toggleFavorite = (changemakerId: number) => {
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
  const handleShare = (changemaker: typeof featuredChangemakers[0]) => {
    const shareText = `Check out ${changemaker.name}, a youth changemaker working on ${changemaker.area} in ${changemaker.location}!`;
    const shareUrl = window.location.href;
    
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
                      src={changemaker.image}
                      alt={changemaker.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{changemaker.name}</h3>
                      <p className="text-gray-600">{changemaker.age} • {changemaker.location}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="inline-block bg-primary/10 text-primary font-semibold px-3 py-1 rounded-full text-sm mb-3">
                      {changemaker.area}
                    </span>
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                      {changemaker.bio}
                    </p>
                    <p className="text-[#DB5A42] font-semibold text-sm">
                      Impact: {changemaker.impact}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                    <span>{changemaker.followers.toLocaleString()} followers</span>
                    <span>{changemaker.projects} projects</span>
                    <span>{changemaker.fundsRaised}</span>
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