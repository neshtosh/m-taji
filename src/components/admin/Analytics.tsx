import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Target,
  BarChart3,
  PieChart,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Analytics as AnalyticsType, Project } from '../../types';

const Analytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsType | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [isLoading, setIsLoading] = useState(true);

  // Mock analytics data
  useEffect(() => {
    const mockAnalytics: AnalyticsType = {
      totalFundsRaised: 125430,
      totalFundsSpent: 89450,
      totalProjects: 12,
      activeProjects: 8,
      completedProjects: 4,
      totalDonors: 1245,
      monthlyGrowth: [
        { month: 'Jan', raised: 15000, spent: 12000 },
        { month: 'Feb', raised: 18000, spent: 14000 },
        { month: 'Mar', raised: 22000, spent: 16000 },
        { month: 'Apr', raised: 19000, spent: 18000 },
        { month: 'May', raised: 25000, spent: 20000 },
        { month: 'Jun', raised: 28000, spent: 22000 },
        { month: 'Jul', raised: 32000, spent: 25000 },
        { month: 'Aug', raised: 35000, spent: 28000 },
        { month: 'Sep', raised: 38000, spent: 30000 },
        { month: 'Oct', raised: 42000, spent: 32000 },
        { month: 'Nov', raised: 45000, spent: 35000 },
        { month: 'Dec', raised: 48000, spent: 38000 }
      ],
      topProjects: [
        { projectId: '1', title: 'School Building Project', raised: 25000, progress: 75 },
        { projectId: '2', title: 'Clean Water Initiative', raised: 18000, progress: 60 },
        { projectId: '3', title: 'Healthcare Access', raised: 15000, progress: 50 },
        { projectId: '4', title: 'Food Security Program', raised: 12000, progress: 40 },
        { projectId: '5', title: 'Emergency Relief', raised: 10000, progress: 80 }
      ],
      donationMethods: [
        { method: 'Stripe', count: 450, amount: 45000 },
        { method: 'PayPal', count: 380, amount: 38000 },
        { method: 'M-Pesa', count: 415, amount: 41500 }
      ]
    };

    setTimeout(() => {
      setAnalytics(mockAnalytics);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getGrowthRate = (current: number, previous: number) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };

  const getGrowthIcon = (rate: number) => {
    return rate >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />;
  };

  const getGrowthColor = (rate: number) => {
    return rate >= 0 ? 'text-teal-600' : 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!analytics) return null;

  const currentMonth = analytics.monthlyGrowth[analytics.monthlyGrowth.length - 1];
  const previousMonth = analytics.monthlyGrowth[analytics.monthlyGrowth.length - 2];
  const raisedGrowth = getGrowthRate(currentMonth.raised, previousMonth.raised);
  const spentGrowth = getGrowthRate(currentMonth.spent, previousMonth.spent);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-text-dark">Analytics Dashboard</h2>
          <p className="text-gray-600">Comprehensive overview of fundraising and project performance</p>
        </div>
        <div className="flex space-x-2">
          {(['7d', '30d', '90d', '1y'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Raised</p>
              <p className="text-2xl font-bold text-text-dark">${analytics.totalFundsRaised.toLocaleString()}</p>
              <div className="flex items-center space-x-1 mt-1">
                {getGrowthIcon(raisedGrowth)}
                <span className={`text-sm font-medium ${getGrowthColor(raisedGrowth)}`}>
                  {Math.abs(raisedGrowth).toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500">vs last month</span>
              </div>
            </div>
            <DollarSign className="h-8 w-8 text-primary" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-text-dark">${analytics.totalFundsSpent.toLocaleString()}</p>
              <div className="flex items-center space-x-1 mt-1">
                {getGrowthIcon(spentGrowth)}
                <span className={`text-sm font-medium ${getGrowthColor(spentGrowth)}`}>
                  {Math.abs(spentGrowth).toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500">vs last month</span>
              </div>
            </div>
            <TrendingDown className="h-8 w-8 text-accent" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Donors</p>
              <p className="text-2xl font-bold text-text-dark">{analytics.totalDonors.toLocaleString()}</p>
              <div className="flex items-center space-x-1 mt-1">
                <TrendingUp className="h-4 w-4 text-teal-600" />
                <span className="text-sm font-medium text-teal-600">+12.5%</span>
                <span className="text-sm text-gray-500">vs last month</span>
              </div>
            </div>
            <Users className="h-8 w-8 text-secondary" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold text-text-dark">{analytics.activeProjects}</p>
              <div className="flex items-center space-x-1 mt-1">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">+2</span>
                <span className="text-sm text-gray-500">new this month</span>
              </div>
            </div>
            <Target className="h-8 w-8 text-blue-500" />
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Growth Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-dark">Monthly Growth</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {analytics.monthlyGrowth.slice(-6).map((month, index) => (
              <div key={month.month} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{month.month}</span>
                  <div className="flex space-x-4">
                    <span className="text-primary">${month.raised.toLocaleString()}</span>
                    <span className="text-accent">${month.spent.toLocaleString()}</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="flex h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary h-2 transition-all duration-300"
                      style={{ width: `${(month.raised / Math.max(...analytics.monthlyGrowth.map(m => m.raised))) * 100}%` }}
                    />
                    <div 
                      className="bg-accent h-2 transition-all duration-300"
                      style={{ width: `${(month.spent / Math.max(...analytics.monthlyGrowth.map(m => m.spent))) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Projects */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-dark">Top Performing Projects</h3>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {analytics.topProjects.map((project, index) => (
              <div key={project.projectId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <h4 className="text-sm font-medium text-text-dark">{project.title}</h4>
                  </div>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-gray-500">${project.raised.toLocaleString()}</span>
                    <span className="text-xs text-gray-500">{project.progress}% complete</span>
                  </div>
                </div>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Payment Methods Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text-dark">Payment Methods Distribution</h3>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-500">Last 30 days</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {analytics.donationMethods.map((method) => (
            <div key={method.method} className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 relative">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={method.method === 'Stripe' ? '#00B8A9' : method.method === 'PayPal' ? '#DB5A42' : '#F1C40F'}
                    strokeWidth="2"
                    strokeDasharray={`${(method.amount / analytics.totalFundsRaised) * 100}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-medium text-text-dark">
                    {((method.amount / analytics.totalFundsRaised) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <h4 className="text-sm font-medium text-text-dark mb-1">{method.method}</h4>
              <p className="text-xs text-gray-500">{method.count} donations</p>
              <p className="text-sm font-medium text-primary">${method.amount.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Project Status Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-text-dark mb-4">Project Status Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{analytics.activeProjects}</div>
            <div className="text-sm text-blue-600 font-medium">Active Projects</div>
            <div className="text-xs text-gray-500 mt-1">Currently running</div>
          </div>
          
                          <div className="text-center p-4 bg-teal-50 rounded-lg">
                  <div className="text-2xl font-bold text-teal-600">{analytics.completedProjects}</div>
                  <div className="text-sm text-teal-600 font-medium">Completed Projects</div>
            <div className="text-xs text-gray-500 mt-1">Successfully finished</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{analytics.totalProjects}</div>
            <div className="text-sm text-purple-600 font-medium">Total Projects</div>
            <div className="text-xs text-gray-500 mt-1">All time</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;