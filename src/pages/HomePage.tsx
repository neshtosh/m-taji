import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../components/home/HeroSection';
import FeaturedCampaigns from '../components/home/FeaturedCampaigns';
import ImpactStats from '../components/home/ImpactStats';
import TestimonialsSection from '../components/home/TestimonialsSection';
import CallToAction from '../components/home/CallToAction';

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      <HeroSection />
      <ImpactStats />
      <FeaturedCampaigns />
      <TestimonialsSection />
      <CallToAction />
    </motion.div>
  );
};

export default HomePage;