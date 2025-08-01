import React, { useState } from 'react';

const CreativeZone: React.FC = () => {
  const [blogText, setBlogText] = useState('');

  const galleryItems = [
    {
      id: 1,
      type: 'image',
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
      alt: 'Tree planting activity',
      caption: 'Community tree planting day'
    },
    {
      id: 2,
      type: 'image',
      src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
      alt: 'Youth workshop',
      caption: 'Environmental leadership workshop'
    },
    {
      id: 3,
      type: 'image',
      src: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop',
      alt: 'Solar panel installation',
      caption: 'Solar energy project completion'
    },
    {
      id: 4,
      type: 'image',
      src: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
      alt: 'Water project',
      caption: 'Clean water initiative success'
    }
  ];

  const handleSubmitBlog = () => {
    if (blogText.trim()) {
      console.log('Blog post submitted:', blogText);
      setBlogText('');
      // Here you would typically send the blog post to your backend
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-200">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Creative Zone</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Microblog Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Share Your Story</h3>
          
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <textarea
              value={blogText}
              onChange={(e) => setBlogText(e.target.value)}
              placeholder="Share your latest project update, inspiration, or community impact story..."
              className="w-full h-32 p-3 border border-amber-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex space-x-2">
                <button className="p-2 text-gray-500 hover:text-amber-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="p-2 text-gray-500 hover:text-amber-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <button
                onClick={handleSubmitBlog}
                disabled={!blogText.trim()}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Share
              </button>
            </div>
          </div>
          
          {/* Upload Media Button */}
          <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300 hover:border-amber-400 transition-colors">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="mt-2 text-sm text-gray-600">Upload photos or videos</p>
              <p className="text-xs text-gray-500">PNG, JPG, MP4 up to 10MB</p>
            </div>
          </div>
        </div>
        
        {/* Gallery Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Gallery</h3>
          
          <div className="grid grid-cols-2 gap-3">
            {galleryItems.map((item) => (
              <div key={item.id} className="relative group cursor-pointer">
                <div className="aspect-w-3 aspect-h-2 bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <p className="text-white text-xs font-medium">{item.caption}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <button className="text-sm text-amber-600 hover:text-amber-800 font-medium">
              View Full Gallery →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeZone; 