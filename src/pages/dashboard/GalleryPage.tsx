import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, Share2, Heart, Eye } from 'lucide-react';

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  likes: number;
  views: number;
  date: string;
}

const GalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([
    {
      id: 1,
      title: 'Solar Installation Project',
      description: 'Installing solar panels in rural schools',
      imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop',
      category: 'projects',
      likes: 24,
      views: 156,
      date: '2024-01-15'
    },
    {
      id: 2,
      title: 'Community Clean-up',
      description: 'Youth volunteers cleaning local parks',
      imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop',
      category: 'events',
      likes: 18,
      views: 89,
      date: '2024-01-10'
    },
    {
      id: 3,
      title: 'Water Purification System',
      description: 'New water purification system installation',
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      category: 'projects',
      likes: 32,
      views: 203,
      date: '2024-01-08'
    },
    {
      id: 4,
      title: 'Youth Training Workshop',
      description: 'Digital skills training for young people',
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
      category: 'events',
      likes: 15,
      views: 67,
      date: '2024-01-05'
    },
    {
      id: 5,
      title: 'Tree Planting Initiative',
      description: 'Planting 1000 trees in urban areas',
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
      category: 'projects',
      likes: 28,
      views: 134,
      date: '2024-01-03'
    },
    {
      id: 6,
      title: 'Fundraising Event',
      description: 'Annual charity fundraising gala',
      imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop',
      category: 'events',
      likes: 42,
      views: 289,
      date: '2024-01-01'
    }
  ]);

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'projects', name: 'Projects' },
    { id: 'events', name: 'Events' },
    { id: 'impact', name: 'Impact Stories' }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  const handleLike = (itemId: number) => {
    setGalleryItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, likes: item.likes + 1 } : item
    ));
  };

  const handleShare = (item: GalleryItem) => {
    const shareText = `Check out this amazing project: ${item.title}`;
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
      alert('Link copied to clipboard!');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Gallery</h1>
          <p className="text-gray-600">Showcase your impact through photos and stories</p>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-amber-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Plus className="h-5 w-5" />
            <span>Add New Item</span>
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                    <button className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100">
                      <Eye className="h-4 w-4 text-gray-700" />
                    </button>
                    <button className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100">
                      <Download className="h-4 w-4 text-gray-700" />
                    </button>
                    <button 
                      onClick={() => handleShare(item)}
                      className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100"
                    >
                      <Share2 className="h-4 w-4 text-gray-700" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg">{item.title}</h3>
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <button 
                      onClick={() => handleLike(item.id)}
                      className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                    >
                      <Heart className="h-4 w-4" />
                      <span>{item.likes}</span>
                    </button>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{item.views}</span>
                    </div>
                  </div>
                  
                  <span className="text-xs text-gray-400">{item.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-600 mb-4">No gallery items match your current filter.</p>
              <button 
                onClick={() => setSelectedCategory('all')}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                View All Items
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default GalleryPage; 