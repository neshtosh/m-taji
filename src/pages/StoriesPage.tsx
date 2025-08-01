import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Calendar, Video, Image, FileText } from 'lucide-react';

const StoriesPage = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = [
    { id: 'all', label: 'All Stories' },
    { id: 'education', label: 'Education' },
    { id: 'healthcare', label: 'Healthcare' },
    { id: 'water', label: 'Clean Water' },
    { id: 'food', label: 'Food Security' },
  ];

  const stories = [
    {
      id: 1,
      title: 'From Drought to Hope: Maria\'s Water Well',
      description: 'Follow Maria\'s journey as her village receives its first clean water well, transforming the lives of 300 families.',
      type: 'video',
      thumbnail: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'Kenya, East Africa',
      date: '2025-01-10',
      category: 'water',
      duration: '5:30',
    },
    {
      id: 2,
      title: 'Building Dreams: New School Construction',
      description: 'A photo series documenting the construction of a new school that will educate 500 children.',
      type: 'gallery',
      thumbnail: 'https://images.pexels.com/photos/8923181/pexels-photo-8923181.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'Uganda, East Africa',
      date: '2025-01-08',
      category: 'education',
      imageCount: 24,
    },
    {
      id: 3,
      title: 'Mobile Clinic Brings Healthcare to Remote Villages',
      description: 'Read about how our mobile clinic is providing essential medical care to communities that were previously unreachable.',
      type: 'article',
      thumbnail: 'https://images.pexels.com/photos/6647019/pexels-photo-6647019.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'Tanzania, East Africa',
      date: '2025-01-05',
      category: 'healthcare',
      readTime: '8 min read',
    },
    {
      id: 4,
      title: 'Feeding Families: Community Garden Success',
      description: 'See how a community garden program is providing fresh vegetables and sustainable income for 50 families.',
      type: 'video',
      thumbnail: 'https://images.pexels.com/photos/6647264/pexels-photo-6647264.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'Rwanda, East Africa',
      date: '2025-01-03',
      category: 'food',
      duration: '7:15',
    },
    {
      id: 5,
      title: 'Solar Power Transforms Rural Clinic',
      description: 'A mini-documentary showing how solar panels have revolutionized healthcare delivery in a remote clinic.',
      type: 'video',
      thumbnail: 'https://images.pexels.com/photos/8923162/pexels-photo-8923162.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'Tanzania, East Africa',
      date: '2024-12-28',
      category: 'healthcare',
      duration: '12:45',
    },
    {
      id: 6,
      title: 'Literacy Program: Children Learning to Read',
      description: 'Heartwarming photos of children in their first literacy classes, discovering the joy of reading.',
      type: 'gallery',
      thumbnail: 'https://images.pexels.com/photos/8923163/pexels-photo-8923163.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'Ghana, West Africa',
      date: '2024-12-25',
      category: 'education',
      imageCount: 18,
    },
  ];

  const filteredStories = stories.filter(story => {
    const matchesFilter = selectedFilter === 'all' || story.category === selectedFilter;
    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         story.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         story.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-red-100 text-red-800';
      case 'gallery':
        return 'bg-blue-100 text-blue-800';
      case 'article':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-16"
    >
      {/* Hero Section */}
      <section className="bg-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold arboria-font mb-6">
              Stories of Impact
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Discover the human stories behind our work. Every campaign, every donation, 
              every life changed has a story worth telling.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter and Search Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-500" />
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedFilter === filter.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStories.map((story, index) => (
              <motion.article
                key={story.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover group cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={story.thumbnail}
                    alt={story.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(story.type)}`}>
                      {getTypeIcon(story.type)}
                      <span className="capitalize">{story.type}</span>
                    </span>
                  </div>
                  {story.duration && (
                    <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                      {story.duration}
                    </div>
                  )}
                  {story.imageCount && (
                    <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                      {story.imageCount} images
                    </div>
                  )}
                  {story.readTime && (
                    <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                      {story.readTime}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-text-dark mb-3 group-hover:text-primary transition-colors">
                    {story.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {story.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{story.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(story.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {filteredStories.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No stories found</h3>
              <p className="text-gray-500">
                Try adjusting your search terms or filters to find more stories.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </motion.div>
  );
};

export default StoriesPage;