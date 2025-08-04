import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Heart, Globe, Award } from 'lucide-react';

const ImpactStats = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [animatedValues, setAnimatedValues] = useState({
    lives: 0,
    donations: 0,
    countries: 0,
    projects: 0,
  });

  const finalValues = {
    lives: 50000,
    donations: 25000,
    countries: 25,
    projects: 150,
  };

  useEffect(() => {
    if (isInView) {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        setAnimatedValues({
          lives: Math.floor(finalValues.lives * progress),
          donations: Math.floor(finalValues.donations * progress),
          countries: Math.floor(finalValues.countries * progress),
          projects: Math.floor(finalValues.projects * progress),
        });

        if (currentStep >= steps) {
          clearInterval(interval);
          setAnimatedValues(finalValues);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    }
  }, [isInView]);

  const stats = [
    {
      icon: Users,
      value: animatedValues.lives,
      label: 'Lives Transformed',
      suffix: '+',
      color: 'text-primary',
      bgColor: 'bg-primary/20',
    },
    {
      icon: Heart,
      value: animatedValues.donations,
      label: 'Generous Donors',
      suffix: '+',
      color: 'text-secondary',
      bgColor: 'bg-secondary/20',
    },
    {
      icon: Globe,
      value: animatedValues.countries,
      label: 'Countries Reached',
      suffix: '+',
      color: 'text-primary',
      bgColor: 'bg-primary/20',
    },
    {
      icon: Award,
      value: animatedValues.projects,
      label: 'Projects Completed',
      suffix: '+',
      color: 'text-secondary',
      bgColor: 'bg-secondary/20',
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white font-bold-rounded mb-4">
            Our Global Impact
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Every number represents a life changed, a community strengthened, and hope restored. 
            Together, we're building a more compassionate world.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="text-center p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 ${stat.bgColor} rounded-full mb-6`}>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <div className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2`}>
                {stat.value.toLocaleString()}{stat.suffix}
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;