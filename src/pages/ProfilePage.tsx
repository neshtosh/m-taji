import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Users, Target, TrendingUp, Heart, Share2, Mail, Phone, FileText, MessageSquare, ShoppingBag, Calendar, Eye, Edit, Trash2, Plus, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchUserBlogPosts, fetchUserMicroblogPosts, fetchUserProducts } from '../lib/userProjects';
import { fetchPublicUserProfile, fetchUserStats } from '../lib/userSearch';
import { toggleFollow, getUserFollowStats, testFollowersTable, getFollowersList, getFollowingList } from '../lib/followers';
import { supabase } from '../lib/supabase';

interface UserContent {
  blogs: any[];
  microblogs: any[];
  products: any[];
}

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'about' | 'blogs' | 'microblogs' | 'shop'>('about');
  const [userContent, setUserContent] = useState<UserContent>({ blogs: [], microblogs: [], products: [] });
  const [profileUser, setProfileUser] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [followStats, setFollowStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [followersList, setFollowersList] = useState<any[]>([]);
  const [followingList, setFollowingList] = useState<any[]>([]);
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const [loadingFollowing, setLoadingFollowing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) {
        setError('No user ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Check if this is the current user's profile
        setIsOwnProfile(user?.id === id);

        // Fetch user profile data
        const profileData = await fetchPublicUserProfile(id);
        if (!profileData) {
          setError('User not found');
          setLoading(false);
          return;
        }
        console.log('ProfilePage - Profile data:', profileData);
        console.log('ProfilePage - Avatar URL:', profileData.avatar_url);
        setProfileUser(profileData);

        // Fetch user stats
        const stats = await fetchUserStats(id);
        console.log('ProfilePage - User stats:', stats);
        setUserStats(stats);

        // Fetch follow stats
        const followStats = await getUserFollowStats(id, user?.id);
        console.log('ProfilePage - Follow stats:', followStats);
        setFollowStats(followStats);
        
        // Test if followers table exists
        try {
          const { data: testData, error: testError } = await supabase
            .from('followers')
            .select('id')
            .limit(1);
          console.log('ProfilePage - Followers table test:', { data: testData, error: testError });
        } catch (error) {
          console.error('ProfilePage - Followers table error:', error);
        }

        // Fetch user content
        const [blogs, microblogs, products] = await Promise.all([
          fetchUserBlogPosts(id),
          fetchUserMicroblogPosts(id),
          fetchUserProducts(id)
        ]);

        setUserContent({
          blogs: blogs || [],
          microblogs: microblogs || [],
          products: products || []
        });
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, user?.id]);

  // Refresh data when component comes into focus (for when user returns from settings)
  useEffect(() => {
    const handleFocus = () => {
      if (id && !loading) {
        // Refetch profile data when window regains focus
        const fetchUserData = async () => {
          try {
            const profileData = await fetchPublicUserProfile(id);
            if (profileData) {
              setProfileUser(profileData);
            }
          } catch (err) {
            console.error('Error refreshing profile data:', err);
          }
        };
        fetchUserData();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [id, loading]);

  const handleShare = () => {
    const shareText = `Check out ${profileUser.name}'s amazing changemaker profile!`;
    const shareUrl = `${window.location.origin}/profile/${id}`;
    
    if (navigator.share) {
      navigator.share({
        title: `${profileUser.name} - Youth Changemaker Profile`,
        text: shareText,
        url: shareUrl
      });
    } else {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      alert('Profile link copied to clipboard!');
    }
  };

  const handleFollow = async () => {
    if (!user) {
      alert('Please sign in to follow changemakers');
      return;
    }

    if (isOwnProfile) {
      alert('You cannot follow yourself');
      return;
    }

    try {
      const result = await toggleFollow(user.id, id!);
      if (result.success) {
        // Update the follow stats locally
        setFollowStats((prev: any) => ({
          ...prev,
          is_following: result.isFollowing,
          followers_count: result.isFollowing 
            ? (prev?.followers_count || 0) + 1
            : Math.max((prev?.followers_count || 0) - 1, 0)
        }));
      } else {
        alert('Failed to update follow status. Please try again.');
      }
    } catch (error) {
      console.error('Error following user:', error);
      alert('Failed to update follow status. Please try again.');
    }
  };

  const handleShowFollowers = async () => {
    if (!id) return;
    
    setLoadingFollowers(true);
    setShowFollowersModal(true);
    
    try {
      const followers = await getFollowersList(id);
      setFollowersList(followers);
    } catch (error) {
      console.error('Error fetching followers:', error);
    } finally {
      setLoadingFollowers(false);
    }
  };

  const handleShowFollowing = async () => {
    if (!id) return;
    
    setLoadingFollowing(true);
    setShowFollowingModal(true);
    
    try {
      const following = await getFollowingList(id);
      setFollowingList(following);
    } catch (error) {
      console.error('Error fetching following:', error);
    } finally {
      setLoadingFollowing(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
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

  // If profileUser is null, it means the user was not found or there was an error
  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">The user you are looking for does not exist.</p>
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

  const tabs = [
    { id: 'about', name: 'About', icon: Users },
    { id: 'blogs', name: 'Blogs', icon: FileText, count: userContent.blogs.length },
    { id: 'microblogs', name: 'Microblogs', icon: MessageSquare, count: userContent.microblogs.length },
    { id: 'shop', name: 'Shop', icon: ShoppingBag, count: userContent.products.length },
  ];

  const renderAboutTab = () => (
    <div className="space-y-8">
      {/* Bio Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          {profileUser.bio || 'This changemaker is making a difference in their community through innovative projects and sustainable solutions.'}
        </p>
        
        {/* Contact Information */}
        {(profileUser.location || profileUser.website) && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-4">
            <h3 className="font-semibold text-gray-800 mb-2">Contact Information</h3>
            <div className="space-y-2">
              {profileUser.location && (
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm">{profileUser.location}</span>
                </div>
              )}
              {profileUser.website && (
                <div className="flex items-center text-gray-700">
                  <Phone className="w-4 h-4 mr-2 text-gray-500" />
                  <a href={profileUser.website} target="_blank" rel="noopener noreferrer" className="text-sm text-teal-600 hover:text-teal-700">
                    {profileUser.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="bg-teal-50 rounded-xl p-4 border border-teal-200">
          <h3 className="font-semibold text-teal-800 mb-2">Impact</h3>
          <p className="text-teal-700">Empowering communities through education, healthcare, and sustainable development initiatives.</p>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">Impact Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button 
            onClick={handleShowFollowers}
            className="text-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <Users className="w-8 h-8 text-teal-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{followStats?.followers_count || 0}</div>
            <div className="text-gray-600 text-sm">Followers</div>
          </button>
          <button 
            onClick={handleShowFollowing}
            className="text-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <Users className="w-8 h-8 text-teal-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{followStats?.following_count || 0}</div>
            <div className="text-gray-600 text-sm">Following</div>
          </button>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <Target className="w-8 h-8 text-teal-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{userStats?.projects || 0}</div>
            <div className="text-gray-600 text-sm">Projects</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <FileText className="w-8 h-8 text-teal-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{userStats?.blogs || 0}</div>
            <div className="text-gray-600 text-sm">Blogs</div>
          </div>
        </div>
      </motion.div>

      {/* Achievements Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">Achievements & Awards</h2>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-teal-50 rounded-lg">
            <div className="w-2 h-2 bg-teal-600 rounded-full mr-3"></div>
            <span className="text-gray-700">Youth Innovation Award 2024</span>
          </div>
          <div className="flex items-center p-3 bg-teal-50 rounded-lg">
            <div className="w-2 h-2 bg-teal-600 rounded-full mr-3"></div>
            <span className="text-gray-700">Community Impact Recognition</span>
          </div>
          <div className="flex items-center p-3 bg-teal-50 rounded-lg">
            <div className="w-2 h-2 bg-teal-600 rounded-full mr-3"></div>
            <span className="text-gray-700">Sustainable Development Champion</span>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderBlogsTab = () => (
    <div className="space-y-6">
      {userContent.blogs.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Blogs Yet</h3>
          <p className="text-gray-600">This changemaker hasn't published any blogs yet.</p>
        </div>
      ) : (
        userContent.blogs.map((blog) => (
          <motion.div
            key={blog.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{blog.title}</h3>
                <p className="text-gray-600 mb-3">{blog.excerpt}</p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {blog.views || 0} views
                </span>
                <span>{blog.readTime || 5} min read</span>
              </div>
              <Link
                to={`/blog/${blog.slug}`}
                className="text-teal-600 hover:text-teal-700 font-medium"
              >
                Read More →
              </Link>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );

  const renderMicroblogsTab = () => (
    <div className="space-y-6">
      {userContent.microblogs.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Microblogs Yet</h3>
          <p className="text-gray-600">This changemaker hasn't posted any microblogs yet.</p>
        </div>
      ) : (
        userContent.microblogs.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>
                <p className="text-gray-600">{post.content}</p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 ml-4">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <Heart className="h-4 w-4 mr-1" />
                  {post.likes || 0} likes
                </span>
                <span className="flex items-center">
                  <Share2 className="h-4 w-4 mr-1" />
                  {post.shares || 0} shares
                </span>
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );

  const renderShopTab = () => (
    <div className="space-y-6">
      {userContent.products.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Yet</h3>
          <p className="text-gray-600">This changemaker hasn't added any products to their shop yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userContent.products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="aspect-square bg-gray-200 flex items-center justify-center">
                {product.images && product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ShoppingBag className="h-12 w-12 text-gray-400" />
                )}
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-teal-600">KSh {product.price.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">{product.stockQuantity} in stock</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

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
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-primary to-primary-dark flex items-center justify-center mx-auto mb-4 border-4 border-teal-200 overflow-hidden">
                  {profileUser.avatar_url ? (
                    <img 
                      src={profileUser.avatar_url} 
                      alt={profileUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-3xl">
                      {profileUser.name?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{profileUser.name}</h1>
                <p className="text-gray-600 mb-2">Youth Changemaker</p>
                <div className="flex items-center justify-center text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{profileUser.location || 'Youth Changemaker'}</span>
                </div>
                <span className="inline-block bg-teal-100 text-teal-800 font-semibold px-4 py-2 rounded-full text-sm">
                  Youth Changemaker
                </span>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-3" />
                  <span className="text-sm">{profileUser.email}</span>
                </div>
                {profileUser.website && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-3" />
                    <span className="text-sm">{profileUser.website}</span>
                  </div>
                )}
                {profileUser.location && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-3" />
                    <span className="text-sm">{profileUser.location}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {isOwnProfile ? (
                  <>
                    <Link 
                      to="/dashboard"
                      className="w-full bg-primary hover:bg-primary-dark text-black font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit My Profile
                    </Link>
                    <button 
                      onClick={handleShare}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors"
                    >
                      <Share2 className="w-4 h-4 mr-2 inline" />
                      Share My Profile
                    </button>

                  </>
                ) : (
                  <>
                    <button 
                      onClick={handleFollow}
                      className={`w-full font-semibold py-3 px-4 rounded-xl transition-colors ${
                        followStats?.is_following
                          ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                          : 'bg-teal-600 hover:bg-teal-700 text-white'
                      }`}
                    >
                      <Heart className="w-4 h-4 mr-2 inline" />
                      {followStats?.is_following ? 'Following' : 'Follow Changemaker'}
                    </button>
                    <button 
                      onClick={handleShare}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors"
                    >
                      <Share2 className="w-4 h-4 mr-2 inline" />
                      Share Profile
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Content Tabs */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 mb-6"
            >
              <div className="flex space-x-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-teal-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.name}</span>
                      {tab.count !== undefined && (
                        <span className="bg-white bg-opacity-20 rounded-full px-2 py-1 text-xs">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {activeTab === 'about' && renderAboutTab()}
              {activeTab === 'blogs' && renderBlogsTab()}
              {activeTab === 'microblogs' && renderMicroblogsTab()}
              {activeTab === 'shop' && renderShopTab()}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Followers Modal */}
      {showFollowersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Followers</h3>
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
      {showFollowingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Following</h3>
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

export default ProfilePage; 