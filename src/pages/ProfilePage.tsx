import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Users, Target, TrendingUp, Heart, Share2, Mail, Phone, FileText, MessageSquare, ShoppingBag, Calendar, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchUserBlogPosts, fetchUserMicroblogPosts, fetchUserProducts } from '../lib/userProjects';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserContent = async () => {
      if (!id) {
        setError('No user ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
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
        console.error('Error fetching user content:', err);
        setError('Failed to load user content');
      } finally {
        setLoading(false);
      }
    };

    fetchUserContent();
  }, [id]);

  const handleShare = () => {
    const shareText = `Check out this amazing changemaker's profile!`;
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: 'Youth Changemaker Profile',
        text: shareText,
        url: shareUrl
      });
    } else {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      alert('Profile link copied to clipboard!');
    }
  };

  const handleFollow = () => {
    alert('You are now following this changemaker!');
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
          Passionate youth changemaker dedicated to creating positive impact in communities through innovative projects and sustainable solutions.
        </p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <Users className="w-8 h-8 text-teal-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">1,240</div>
            <div className="text-gray-600 text-sm">Followers</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <Target className="w-8 h-8 text-teal-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">8</div>
            <div className="text-gray-600 text-sm">Projects</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <TrendingUp className="w-8 h-8 text-teal-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">KSh 450K</div>
            <div className="text-gray-600 text-sm">Funds Raised</div>
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
                <img
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face"
                  alt="Changemaker Profile"
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-teal-200"
                />
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Sarah Mwangi</h1>
                <p className="text-gray-600 mb-2">24 years old</p>
                <div className="flex items-center justify-center text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>Nairobi, Kenya</span>
                </div>
                <span className="inline-block bg-teal-100 text-teal-800 font-semibold px-4 py-2 rounded-full text-sm">
                  Education & Youth Empowerment
                </span>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-3" />
                  <span className="text-sm">sarah.mwangi@example.com</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-3" />
                  <span className="text-sm">+254 700 123 456</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={handleFollow}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
                >
                  <Heart className="w-4 h-4 mr-2 inline" />
                  Follow Changemaker
                </button>
                <button 
                  onClick={handleShare}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors"
                >
                  <Share2 className="w-4 h-4 mr-2 inline" />
                  Share Profile
                </button>
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
    </motion.div>
  );
};

export default ProfilePage; 