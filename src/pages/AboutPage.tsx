import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Globe, Award, Target, Eye } from 'lucide-react';

const AboutPage = () => {
  const values = [
    {
      icon: Heart,
      title: 'Compassion First',
      description: 'Every decision we make is guided by empathy and understanding for those we serve.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'We believe in empowering local communities to lead their own transformation.',
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'Our reach extends across continents, but our focus remains on local solutions.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for the highest standards in everything we do, ensuring maximum impact.',
    },
  ];

  const team = [
    {
      name: 'Sarah Mitchell',
      role: 'Executive Director',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: '15+ years in international development and humanitarian work.',
    },
    {
      name: 'Dr. James Chen',
      role: 'Program Director',
      image: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Former WHO consultant specializing in healthcare access in developing regions.',
    },
    {
      name: 'Maria Rodriguez',
      role: 'Regional Coordinator',
      image: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Local community leader with deep expertise in grassroots organizing.',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-16 bg-white dark:bg-gray-900"
    >
      {/* Hero Section */}
      <section className="bg-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold font-bold-rounded mb-6 text-primary">
              About M-taji
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              M-taji believes in the power of collective compassion to create lasting change across Africa. 
              Learn about our journey, values, and our commitment to empowering African communities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <Target className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white font-bold-rounded">Our Mission</h2>
              </div>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-4 sm:mb-6">
                To empower African communities through sustainable development programs that 
                address critical needs in education, healthcare, clean water, and food security. 
                We work directly with local leaders to ensure solutions are culturally appropriate 
                and community-driven.
              </p>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Every project we undertake is designed to create lasting change that communities 
                can maintain and expand upon long after our initial support.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-secondary" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white font-bold-rounded">Our Vision</h2>
              </div>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-4 sm:mb-6">
                A world where every person has access to the fundamental resources needed to 
                thrive: clean water, quality education, healthcare, and nutritious food across Africa. 
                We envision communities that are resilient, self-sufficient, and empowered 
                to chart their own course toward prosperity.
              </p>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Through transparent partnerships and innovative solutions, we strive to build 
                bridges between those who wish to help and those who need support.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white font-bold-rounded mb-4">
              Our Core Values
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              These principles guide every decision we make and every program we implement.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {values.map((value, index) => {
              // Define colors for each icon
              const colors = [
                { icon: 'text-primary', bg: 'bg-primary-light/10' }, // Mustard for Heart
                { icon: 'text-secondary', bg: 'bg-secondary-light/10' }, // Teal for Users
                { icon: 'text-red', bg: 'bg-red-light/10' }, // Red for Globe
                { icon: 'text-primary', bg: 'bg-primary-light/10' }, // Mustard for Award
              ];
              
              const colorScheme = colors[index];
              
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${colorScheme.bg} rounded-full mb-6`}>
                    <value.icon className={`h-8 w-8 ${colorScheme.icon}`} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white font-bold-rounded mb-3 sm:mb-4">{value.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold font-artistic italic mb-4 sm:mb-6">
              Join Our Mission
            </h2>
            <p className="text-lg sm:text-xl text-white mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Whether through donations, volunteering, or spreading awareness, 
              there are many ways to be part of our community of changemakers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-primary hover:bg-primary-dark text-black font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">
                Become a Donor
              </button>
              <button className="border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-secondary transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">
                Volunteer With Us
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default AboutPage;