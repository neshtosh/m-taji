import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, User, Eye, Heart, MessageCircle } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  views: number;
  likes: number;
  comments: number;
}

const BlogPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "The Future of Digital Education in Rural Kenya",
      excerpt: "Exploring innovative approaches to bridge the digital divide and bring quality education to underserved communities through technology and community-driven solutions.",
      author: "Sarah Njeri",
      date: "March 15, 2024",
      readTime: "5 min read",
      category: "Education",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop",
      views: 1240,
      likes: 89,
      comments: 23
    },
    {
      id: 2,
      title: "Sustainable Water Solutions: A Community Success Story",
      excerpt: "How one youth-led initiative transformed access to clean water for over 500 families in rural communities, creating lasting impact and inspiring change.",
      author: "David Ochieng",
      date: "March 12, 2024",
      readTime: "7 min read",
      category: "Environment",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop",
      views: 980,
      likes: 67,
      comments: 18
    },
    {
      id: 3,
      title: "Empowering Youth Through Agricultural Innovation",
      excerpt: "Modern farming techniques and sustainable practices are revolutionizing agriculture in Kenya, creating opportunities for young farmers and ensuring food security.",
      author: "Brian Kipkoech",
      date: "March 10, 2024",
      readTime: "6 min read",
      category: "Agriculture",
      image: "https://images.unsplash.com/photo-1574943320219-553eb213f72f?w=400&h=200&fit=crop",
      views: 856,
      likes: 54,
      comments: 15
    },
    {
      id: 4,
      title: "Building Climate Resilience: Youth-Led Environmental Action",
      excerpt: "Young changemakers are leading the charge in climate action, implementing innovative solutions to protect our environment and secure a sustainable future.",
      author: "Wanjiku Maina",
      date: "March 8, 2024",
      readTime: "8 min read",
      category: "Climate Action",
      image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=200&fit=crop",
      views: 1120,
      likes: 76,
      comments: 21
    },
    {
      id: 5,
      title: "Digital Literacy: Bridging the Technology Gap",
      excerpt: "How technology education programs are empowering communities with digital skills, opening new opportunities for employment and entrepreneurship.",
      author: "Amina Hassan",
      date: "March 5, 2024",
      readTime: "4 min read",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop",
      views: 743,
      likes: 42,
      comments: 12
    },
    {
      id: 6,
      title: "Waste to Wealth: Innovative Recycling Solutions",
      excerpt: "Transforming waste management through creative recycling programs that generate income while protecting our environment and creating sustainable communities.",
      author: "Sarah Njeri",
      date: "March 3, 2024",
      readTime: "6 min read",
      category: "Environment",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop",
      views: 692,
      likes: 38,
      comments: 9
    }
  ];

  const categories = [
    { id: 'all', name: 'All Posts' },
    { id: 'education', name: 'Education' },
    { id: 'environment', name: 'Environment' },
    { id: 'agriculture', name: 'Agriculture' },
    { id: 'climate-action', name: 'Climate Action' },
    { id: 'technology', name: 'Technology' }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           post.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
            <div className="min-h-screen bg-gradient-to-br from-primary/10 to-orange-100">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              M-TAJI Blog
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Stories of impact, innovation, and inspiration from youth changemakers across Kenya
            </p>
            
            {/* Search and Filter */}
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search blog posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <Link to={`/blog/${post.id}`}>
                <div className="h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="px-3 py-1 bg-primary/20 text-primary-dark text-xs font-medium rounded-full">
                      {post.category}
                    </span>
                    <span className="text-gray-500 text-sm">{post.readTime}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {post.author.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{post.author}</p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>{post.date}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{post.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BlogPage; 