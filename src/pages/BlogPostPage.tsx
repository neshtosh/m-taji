import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin,
  Bookmark
} from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  author: string;
  authorBio: string;
  authorImage: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  views: number;
  likes: number;
  comments: number;
  tags: string[];
}

const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Mock blog post data - in a real app, this would come from an API
  const blogPost: BlogPost = {
    id: parseInt(id || '1'),
    title: "The Future of Digital Education in Rural Kenya",
    content: `
      <p class="mb-6 text-lg leading-relaxed">
        In the heart of rural Kenya, where internet connectivity was once a distant dream, 
        young changemakers are revolutionizing education through innovative digital solutions. 
        This transformation isn't just about technology—it's about creating opportunities, 
        bridging gaps, and empowering communities to shape their own future.
      </p>

      <h2 class="text-2xl font-bold text-gray-900 mb-4">The Challenge</h2>
      <p class="mb-6 text-lg leading-relaxed">
        Rural communities in Kenya face significant barriers to quality education. 
        Limited infrastructure, lack of qualified teachers, and geographical isolation 
        have created an educational divide that affects millions of children. Traditional 
        approaches to education delivery simply weren't reaching these communities effectively.
      </p>

      <h2 class="text-2xl font-bold text-gray-900 mb-4">The Innovation</h2>
      <p class="mb-6 text-lg leading-relaxed">
        Enter the digital revolution, led by youth changemakers who understand both 
        the challenges and the potential of their communities. Through innovative 
        approaches combining mobile technology, solar power, and community-driven 
        solutions, these young leaders are creating sustainable educational ecosystems.
      </p>

      <blockquote class="border-l-4 border-amber-500 pl-6 my-8 italic text-lg text-gray-700">
        "Education is not just about reading and writing—it's about empowering 
        communities to solve their own problems and create their own opportunities."
      </blockquote>

      <h2 class="text-2xl font-bold text-gray-900 mb-4">The Impact</h2>
      <p class="mb-6 text-lg leading-relaxed">
        The results have been nothing short of transformative. In communities where 
        digital literacy was once unheard of, children are now coding, creating, 
        and connecting with the world. Parents are learning new skills, and entire 
        communities are experiencing economic revitalization through technology-enabled opportunities.
      </p>

      <h2 class="text-2xl font-bold text-gray-900 mb-4">Looking Forward</h2>
      <p class="mb-6 text-lg leading-relaxed">
        As we look to the future, the potential for digital education in rural Kenya 
        is limitless. With continued innovation, community support, and youth leadership, 
        we can ensure that every child, regardless of their location, has access to 
        quality education and the tools they need to succeed in the digital age.
      </p>
    `,
    author: "Sarah Njeri",
    authorBio: "Environmental advocate and education innovator working to bridge the digital divide in rural communities. Leading projects that combine technology with sustainable development.",
    authorImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    date: "March 15, 2024",
    readTime: "5 min read",
    category: "Education",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop",
    views: 1240,
    likes: 89,
    comments: 23,
    tags: ["Education", "Technology", "Rural Development", "Digital Literacy"]
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blogPost.title,
        text: blogPost.content.substring(0, 100) + '...',
        url: window.location.href,
      });
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Back Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link 
            to="/blog"
            className="flex items-center space-x-2 text-gray-600 hover:text-amber-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Blog</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Article Header */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="h-96 overflow-hidden">
              <img
                src={blogPost.image}
                alt={blogPost.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8">
              <div className="flex items-center space-x-2 mb-4">
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full">
                  {blogPost.category}
                </span>
                <span className="text-gray-500 text-sm">{blogPost.readTime}</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {blogPost.title}
              </h1>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={blogPost.authorImage}
                    alt={blogPost.author}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{blogPost.author}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{blogPost.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{blogPost.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isLiked 
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{blogPost.likes + (isLiked ? 1 : 0)}</span>
                  </button>
                  <button
                    onClick={handleBookmark}
                    className={`p-2 rounded-lg transition-colors ${
                      isBookmarked 
                        ? 'bg-amber-100 text-amber-600' 
                        : 'bg-gray-100 text-gray-600 hover:bg-amber-100 hover:text-amber-600'
                    }`}
                  >
                    <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: blogPost.content }}
                />
                
                {/* Tags */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {blogPost.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Author Info */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Author</h3>
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={blogPost.authorImage}
                    alt={blogPost.author}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{blogPost.author}</p>
                    <p className="text-sm text-gray-500">Youth Changemaker</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {blogPost.authorBio}
                </p>
              </div>

              {/* Engagement Stats */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Views</span>
                    </div>
                    <span className="font-semibold text-gray-900">{blogPost.views}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Heart className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Likes</span>
                    </div>
                    <span className="font-semibold text-gray-900">{blogPost.likes}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Comments</span>
                    </div>
                    <span className="font-semibold text-gray-900">{blogPost.comments}</span>
                  </div>
                </div>
              </div>

              {/* Share */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Share</h3>
                <div className="flex space-x-2">
                  <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Facebook className="h-4 w-4" />
                  </button>
                  <button className="p-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors">
                    <Twitter className="h-4 w-4" />
                  </button>
                  <button className="p-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors">
                    <Linkedin className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPostPage; 