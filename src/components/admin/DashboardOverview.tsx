import React from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Users, 
  Heart, 
  TrendingUp, 
  Calendar,
  MapPin,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const DashboardOverview = () => {
  const stats = [
    {
      title: 'Total Donations',
      value: '$125,430',
      change: '+12.5%',
      changeType: 'increase',
      icon: DollarSign,
          color: 'text-teal-600',
    bgColor: 'bg-teal-100',
    },
    {
      title: 'Active Campaigns',
      value: '8',
      change: '+2',
      changeType: 'increase',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Total Donors',
      value: '1,245',
      change: '+8.2%',
      changeType: 'increase',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '-0.3%',
      changeType: 'decrease',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const recentDonations = [
    {
      id: 1,
      donor: 'Sarah Johnson',
      amount: '$500',
      campaign: 'Clean Water Initiative',
      time: '2 hours ago',
    },
    {
      id: 2,
      donor: 'Michael Chen',
      amount: '$250',
      campaign: 'Education for All',
      time: '4 hours ago',
    },
    {
      id: 3,
      donor: 'Emma Rodriguez',
      amount: '$100',
      campaign: 'Healthcare Access',
      time: '6 hours ago',
    },
    {
      id: 4,
      donor: 'David Wilson',
      amount: '$750',
      campaign: 'Food Security',
      time: '8 hours ago',
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Monthly Donor Webinar',
      date: 'Jan 25, 2025',
      time: '2:00 PM EST',
      type: 'Virtual',
    },
    {
      id: 2,
      title: 'Field Visit Documentation',
      date: 'Jan 28, 2025',
      time: '9:00 AM',
      type: 'Field Work',
    },
    {
      id: 3,
      title: 'Board Meeting',
      date: 'Feb 1, 2025',
      time: '10:00 AM EST',
      type: 'Meeting',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 arboria-font">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your charity platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className={`flex items-center space-x-1 text-sm ${
                stat.changeType === 'increase' ? 'text-teal-600' : 'text-red-600'
              }`}>
                {stat.changeType === 'increase' ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
                <span>{stat.change}</span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Donations */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Donations</h2>
          <div className="space-y-4">
            {recentDonations.map((donation, index) => (
              <div key={donation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{donation.donor}</h3>
                  <p className="text-sm text-gray-600">{donation.campaign}</p>
                  <p className="text-xs text-gray-500">{donation.time}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-teal-600">{donation.amount}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm">
            View All Donations →
          </button>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={event.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{event.title}</h3>
                  <p className="text-sm text-gray-600">{event.date} at {event.time}</p>
                  <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {event.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm">
            View All Events →
          </button>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <Heart className="h-6 w-6 text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Create Campaign</h3>
            <p className="text-sm text-gray-600">Start a new fundraising campaign</p>
          </button>
                          <button className="p-4 text-left bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors">
                  <Users className="h-6 w-6 text-teal-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Add Content</h3>
            <p className="text-sm text-gray-600">Upload stories and media</p>
          </button>
          <button className="p-4 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <TrendingUp className="h-6 w-6 text-purple-600 mb-2" />
            <h3 className="font-semibold text-gray-900">View Analytics</h3>
            <p className="text-sm text-gray-600">Check performance metrics</p>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardOverview;