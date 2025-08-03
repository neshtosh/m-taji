import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Heart, MessageCircle, Share2, MoreVertical, Image, Video, Link } from 'lucide-react';

interface MicroPost {
  id: number;
  content: string;
  author: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  isLiked: boolean;
  media?: {
    type: 'image' | 'video';
    url: string;
  };
}

const MicroblogPage: React.FC = () => {
  const [posts, setPosts] = useState<MicroPost[]>([
    {
      id: 1,
      content: "Just completed our solar panel installation at Muthiga Primary School! 500 students will now have access to clean energy. The joy on their faces was priceless. #CleanEnergy #YouthImpact",
      author: "Amina Kiptoo",
      likes: 24,
      comments: 8,
      shares: 12,
      timestamp: "2 hours ago",
      isLiked: false,
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop'
      }
    },
    {
      id: 2,
      content: "Excited to announce our new water purification project in Kisumu! Partnering with local youth groups to provide clean water to 3 communities. Looking for volunteers! 💧 #WaterForAll",
      author: "David Ochieng",
      likes: 18,
      comments: 15,
      shares: 6,
      timestamp: "5 hours ago",
      isLiked: true
    },
    {
      id: 3,
      content: "Today's digital literacy workshop was a huge success! 50 young people learned basic computer skills. Seeing their confidence grow was amazing. Technology is truly empowering! 💻 #DigitalLiteracy",
      author: "Sarah Njeri",
      likes: 32,
      comments: 12,
      shares: 8,
      timestamp: "1 day ago",
      isLiked: false,
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop'
      }
    }
  ]);

  const [newPost, setNewPost] = useState('');
  const [showCompose, setShowCompose] = useState(false);

  const handleLike = (postId: number) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
        : post
    ));
  };

  const handleShare = (post: MicroPost) => {
    const shareText = `${post.content.substring(0, 100)}...`;
    if (navigator.share) {
      navigator.share({
        title: `Post by ${post.author}`,
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
      alert('Post link copied to clipboard!');
    }
  };

  const handleSubmitPost = () => {
    if (newPost.trim()) {
      const newPostObj: MicroPost = {
        id: Date.now(),
        content: newPost,
        author: "You",
        likes: 0,
        comments: 0,
        shares: 0,
        timestamp: "Just now",
        isLiked: false
      };
      setPosts(prev => [newPostObj, ...prev]);
      setNewPost('');
      setShowCompose(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Microblog</h1>
          <p className="text-gray-600">Share your impact stories and connect with the community</p>
        </div>

        {/* Compose New Post */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">A</span>
            </div>
            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's happening in your community today?"
                className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                rows={3}
              />
              
              <div className="flex justify-between items-center mt-3">
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-500 hover:text-amber-600 transition-colors">
                    <Image className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-amber-600 transition-colors">
                    <Video className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-amber-600 transition-colors">
                    <Link className="h-5 w-5" />
                  </button>
                </div>
                
                <button
                  onClick={handleSubmitPost}
                  disabled={!newPost.trim()}
                  className="bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* Post Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {post.author.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{post.author}</h3>
                      <p className="text-sm text-gray-500">{post.timestamp}</p>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-6">
                <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>
                
                {/* Media */}
                {post.media && (
                  <div className="mb-4">
                    <img
                      src={post.media.url}
                      alt="Post media"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-2 transition-colors ${
                        post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${post.isLiked ? 'fill-current' : ''}`} />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-amber-600 transition-colors">
                      <MessageCircle className="h-5 w-5" />
                      <span className="text-sm">{post.comments}</span>
                    </button>
                    
                    <button
                      onClick={() => handleShare(post)}
                      className="flex items-center space-x-2 text-gray-500 hover:text-amber-600 transition-colors"
                    >
                      <Share2 className="h-5 w-5" />
                      <span className="text-sm">{post.shares}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600 mb-4">Be the first to share your impact story!</p>
              <button 
                onClick={() => setShowCompose(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Create Your First Post
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default MicroblogPage; 