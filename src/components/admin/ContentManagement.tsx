import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, Image, Video, FileText, Upload, Calendar } from 'lucide-react';

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('all');

  const content = [
    {
      id: 1,
      title: 'Clean Water Initiative Progress Update',
      type: 'video',
      status: 'published',
      author: 'Sarah Mitchell',
      date: '2025-01-15',
      views: 1240,
      thumbnail: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=300',
      duration: '5:30',
    },
    {
      id: 2,
      title: 'Education Program Photo Gallery',
      type: 'gallery',
      status: 'published',
      author: 'Maria Rodriguez',
      date: '2025-01-14',
      views: 892,
      thumbnail: 'https://images.pexels.com/photos/8613082/pexels-photo-8613082.jpeg?auto=compress&cs=tinysrgb&w=300',
      imageCount: 24,
    },
    {
      id: 3,
      title: 'Healthcare Access Annual Report',
      type: 'article',
      status: 'draft',
      author: 'Dr. James Chen',
      date: '2025-01-13',
      views: 0,
      thumbnail: 'https://images.pexels.com/photos/6129507/pexels-photo-6129507.jpeg?auto=compress&cs=tinysrgb&w=300',
      wordCount: 2450,
    },
    {
      id: 4,
      title: 'Emergency Relief Documentation',
      type: 'video',
      status: 'scheduled',
      author: 'David Wilson',
      date: '2025-01-20',
      views: 0,
      thumbnail: 'https://images.pexels.com/photos/6995247/pexels-photo-6995247.jpeg?auto=compress&cs=tinysrgb&w=300',
      duration: '8:15',
    },
  ];

  const tabs = [
    { id: 'all', label: 'All Content', count: content.length },
    { id: 'video', label: 'Videos', count: content.filter(c => c.type === 'video').length },
    { id: 'gallery', label: 'Galleries', count: content.filter(c => c.type === 'gallery').length },
    { id: 'article', label: 'Articles', count: content.filter(c => c.type === 'article').length },
  ];

  const filteredContent = activeTab === 'all' ? content : content.filter(c => c.type === activeTab);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-teal-100 text-teal-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'archived':
        return 'bg-primary/20 text-primary-dark';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'gallery':
        return <Image className="h-4 w-4" />;
      case 'article':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 arboria-font">Content Management</h1>
          <p className="text-gray-600 mt-2">Create and manage stories, videos, and media content.</p>
        </div>
                        <button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Add Content</span>
        </button>
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Content', value: '42', icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-100' },
          { label: 'Published', value: '28', icon: Eye, color: 'text-teal-600', bgColor: 'bg-teal-100' },
          { label: 'Draft', value: '8', icon: Edit, color: 'text-primary', bgColor: 'bg-primary/20' },
          { label: 'Total Views', value: '15.2K', icon: Eye, color: 'text-purple-600', bgColor: 'bg-purple-100' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        {/* Content Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <span className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                      item.type === 'video' ? 'bg-red-100 text-red-800' :
                      item.type === 'gallery' ? 'bg-blue-100 text-blue-800' :
                      'bg-teal-100 text-teal-800'
                    }`}>
                      {getTypeIcon(item.type)}
                      <span className="capitalize">{item.type}</span>
                    </span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  {item.duration && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                      {item.duration}
                    </div>
                  )}
                  {item.imageCount && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                      {item.imageCount} images
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span>{item.author}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Eye className="h-4 w-4" />
                      <span>{item.views.toLocaleString()} views</span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-700">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-teal-600 hover:text-teal-700">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentManagement;