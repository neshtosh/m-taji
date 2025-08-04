import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, ArrowRight } from 'lucide-react';
import DonationModal from '../ui/DonationModal';

const CallToAction = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <section className="py-20 bg-secondary relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white bg-opacity-5 rounded-full animate-float" />
        <div className="absolute top-1/3 right-20 w-24 h-24 bg-accent bg-opacity-10 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-primary bg-opacity-10 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center text-white"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-10 rounded-full mb-8 backdrop-blur-sm">
            <Heart className="h-10 w-10 text-white" fill="currentColor" />
          </div>

          <h2 className="text-4xl md:text-6xl font-bold font-bold-rounded mb-6">
            Ready to Make a 
            <span className="block text-primary">
              Lasting Impact?
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-white mb-12 max-w-3xl mx-auto leading-relaxed">
            Your generosity can transform lives, rebuild communities, and restore hope. 
            Join our global family of changemakers today.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary bg-opacity-20 rounded-full mb-4 backdrop-blur-sm">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Direct Impact</h3>
              <p className="text-white">100% of your donation goes directly to programs</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary bg-opacity-20 rounded-full mb-4 backdrop-blur-sm">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Community</h3>
              <p className="text-white">Join 25,000+ donors making a difference</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary bg-opacity-20 rounded-full mb-4 backdrop-blur-sm">
                <ArrowRight className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real Results</h3>
              <p className="text-white">Track your impact with regular updates</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={() => setShowModal(true)}
              className="bg-primary hover:bg-primary-dark text-black font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <Heart className="h-5 w-5" fill="currentColor" />
              <span>Start Your Impact Journey</span>
            </button>

            <button className="glass-effect text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 hover:bg-white hover:bg-opacity-20 border border-white">
              Learn More About Our Work
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            viewport={{ once: true }}
            className="text-white mt-8 text-sm"
          >
            Tax-deductible donations • Secure payment processing • Cancel anytime
          </motion.p>
        </motion.div>
      </div>

      <DonationModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </section>
  );
};

export default CallToAction;