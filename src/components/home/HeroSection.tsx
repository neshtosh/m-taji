import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';
import DonationModal from '../ui/DonationModal';
import ImageSlider from './ImageSlider';

const HeroSection = () => {
  const [showModal, setShowModal] = useState(false);

  // Add your local image paths here
  const heroImages = [
    '/images/hero1.jpeg', // Replace with your actual image path
    '/images/hero2.jpeg', // Replace with your actual image path
    // Fallback images (will be used if local images don't exist)
    
  ];

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Image Slider Background */}
      <div className="absolute inset-0 z-0">
        <ImageSlider images={heroImages} autoPlayInterval={6000} />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 z-10">
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full backdrop-blur-sm"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 right-20 w-16 h-16 bg-accent bg-opacity-20 rounded-full backdrop-blur-sm"
        />
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-32 left-1/4 w-12 h-12 bg-primary bg-opacity-20 rounded-full backdrop-blur-sm"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-bold-rounded mb-6 leading-tight">
            Transform Lives
            <span className="block text-white font-bold-rounded">
              Through Compassion
            </span>
          </h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl mb-8 text-white max-w-2xl mx-auto leading-relaxed"
          >
            Join thousands of changemakers creating lasting impact in communities worldwide. 
            Every donation tells a story of hope, healing, and human connection.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={() => setShowModal(true)}
              className="bg-primary hover:bg-primary-dark text-black font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <span>Start Giving Today</span>
              <ArrowRight className="h-5 w-5" />
            </button>

            <button className="glass-effect text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 hover:bg-white hover:bg-opacity-20 flex items-center space-x-2 border border-white">
              <Play className="h-5 w-5" />
              <span>Watch Our Story</span>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          >
            <div className="glass-effect p-6 rounded-lg">
              <div className="text-3xl font-bold text-amber-400">50K+</div>
              <div className="text-white">Lives Impacted</div>
            </div>
            <div className="glass-effect p-6 rounded-lg">
              <div className="text-3xl font-bold text-red-400">$2.5M</div>
              <div className="text-white">Funds Raised</div>
            </div>
            <div className="glass-effect p-6 rounded-lg">
              <div className="text-3xl font-bold text-teal-400">25+</div>
              <div className="text-white">Countries Served</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <DonationModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </section>
  );
};

export default HeroSection;