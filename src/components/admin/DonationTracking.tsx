import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar,
  Filter,
  Download,
  Eye,
  Plus,
  CreditCard,
  Smartphone
} from 'lucide-react';
import { Donation, Project, Expenditure } from '../../types';

const DonationTracking = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [expenditures, setExpenditures] = useState<Expenditure[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'project' | 'general'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [filterMethod, setFilterMethod] = useState<'all' | 'stripe' | 'paypal' | 'mpesa'>('all');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: ''
  });

  // Mock data
  useEffect(() => {
    const mockDonations: Donation[] = [
      {
        id: '1',
        amount: 500,
        type: 'project',
        projectId: '1',
        donorName: 'John Doe',
        donorEmail: 'john@example.com',
        donorPhone: '+1234567890',
        paymentMethod: 'stripe',
        paymentStatus: 'completed',
        transactionId: 'txn_123456',
        message: 'Happy to support this cause!',
        isAnonymous: false,
        createdAt: new Date('2024-01-15'),
        expenditures: []
      },
      {
        id: '2',
        amount: 1000,
        type: 'general',
        donorName: 'Jane Smith',
        donorEmail: 'jane@example.com',
        donorPhone: '+1234567891',
        paymentMethod: 'paypal',
        paymentStatus: 'completed',
        transactionId: 'txn_123457',
        message: 'Keep up the great work!',
        isAnonymous: false,
        createdAt: new Date('2024-01-20'),
        expenditures: []
      },
      {
        id: '3',
        amount: 250,
        type: 'project',
        projectId: '2',
        donorName: 'Anonymous',
        donorEmail: 'anonymous@example.com',
        paymentMethod: 'mpesa',
        paymentStatus: 'completed',
        transactionId: 'txn_123458',
        isAnonymous: true,
        createdAt: new Date('2024-01-25'),
        expenditures: []
      }
    ];

    const mockProjects: Project[] = [
      {
        id: '1',
        title: 'School Building Project',
        description: 'Building a new school in rural Kenya',
        category: 'education',
        location: 'Nairobi, Kenya',
        targetAmount: 50000,
        raisedAmount: 15000,
        status: 'ongoing',
        media: { images: [], videos: [] },
        progress: 30,
        startDate: new Date('2024-01-01'),
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        updates: [],
        expenditures: [],
        donations: []
      },
      {
        id: '2',
        title: 'Clean Water Initiative',
        description: 'Providing clean water to communities',
        category: 'water',
        location: 'Mombasa, Kenya',
        targetAmount: 30000,
        raisedAmount: 8000,
        status: 'ongoing',
        media: { images: [], videos: [] },
        progress: 27,
        startDate: new Date('2024-01-10'),
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
        updates: [],
        expenditures: [],
        donations: []
      }
    ];

    const mockExpenditures: Expenditure[] = [
      {
        id: '1',
        projectId: '1',
        donationId: '1',
        title: 'Building Materials',
        amount: 300,
        date: new Date('2024-01-16'),
        description: 'Purchase of cement and bricks',
        category: 'materials',
        createdAt: new Date('2024-01-16'),
        createdBy: 'admin'
      },
      {
        id: '2',
        projectId: '1',
        title: 'Labor Costs',
        amount: 200,
        date: new Date('2024-01-18'),
        description: 'Payment for construction workers',
        category: 'labor',
        createdAt: new Date('2024-01-18'),
        createdBy: 'admin'
      }
    ];

    setDonations(mockDonations);
    setProjects(mockProjects);
    setExpenditures(mockExpenditures);
  }, []);

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'stripe':
        return <CreditCard className="h-4 w-4" />;
      case 'paypal':
        return <CreditCard className="h-4 w-4" />;
      case 'mpesa':
        return <Smartphone className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
          switch (status) {
        case 'completed':
          return 'bg-teal-100 text-teal-800';
        case 'pending':
          return 'bg-yellow-100 text-yellow-800';
        case 'failed':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'stripe':
        return 'bg-blue-100 text-blue-800';
      case 'paypal':
        return 'bg-indigo-100 text-indigo-800';
      case 'mpesa':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDonations = donations.filter(donation => {
    const typeMatch = filterType === 'all' || donation.type === filterType;
    const statusMatch = filterStatus === 'all' || donation.paymentStatus === filterStatus;
    const methodMatch = filterMethod === 'all' || donation.paymentMethod === filterMethod;
    const projectMatch = selectedProject === 'all' || donation.projectId === selectedProject;
    
    const dateMatch = !dateRange.start || !dateRange.end || 
      (new Date(donation.createdAt) >= new Date(dateRange.start) && 
       new Date(donation.createdAt) <= new Date(dateRange.end));

    return typeMatch && statusMatch && methodMatch && projectMatch && dateMatch;
  });

  const totalRaised = donations.reduce((sum, d) => sum + d.amount, 0);
  const totalSpent = expenditures.reduce((sum, e) => sum + e.amount, 0);
  const totalDonors = new Set(donations.map(d => d.donorEmail)).size;

  const getProjectName = (projectId?: string) => {
    if (!projectId) return 'General Fund';
    const project = projects.find(p => p.id === projectId);
    return project?.title || 'Unknown Project';
  };

  const getExpendituresForDonation = (donationId: string) => {
    return expenditures.filter(e => e.donationId === donationId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-text-dark">Donation Tracking</h2>
          <p className="text-gray-600">Monitor donations and expenditures across all projects</p>
        </div>
        <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-full flex items-center space-x-2 transition-colors">
          <Download className="h-5 w-5" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Raised</p>
              <p className="text-2xl font-bold text-text-dark">${totalRaised.toLocaleString()}</p>
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
              <p className="text-2xl font-bold text-text-dark">${totalSpent.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-accent" />
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
              <p className="text-2xl font-bold text-text-dark">{totalDonors}</p>
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
              <p className="text-sm text-gray-600">Available Funds</p>
              <p className="text-2xl font-bold text-text-dark">${(totalRaised - totalSpent).toLocaleString()}</p>
            </div>
                            <DollarSign className="h-8 w-8 text-teal-500" />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-text-dark">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="project">Project Specific</option>
              <option value="general">General Fund</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">Payment Method</label>
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Methods</option>
              <option value="stripe">Stripe</option>
              <option value="paypal">PayPal</option>
              <option value="mpesa">M-Pesa</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">Project</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Projects</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">Date Range</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-text-dark">Donations ({filteredDonations.length})</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Donor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDonations.map((donation) => (
                <motion.tr
                  key={donation.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-text-dark">
                        {donation.isAnonymous ? 'Anonymous' : donation.donorName}
                      </div>
                      <div className="text-sm text-gray-500">{donation.donorEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-text-dark">
                      ${donation.amount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {getProjectName(donation.projectId)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getPaymentMethodIcon(donation.paymentMethod)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMethodColor(donation.paymentMethod)}`}>
                        {donation.paymentMethod}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.paymentStatus)}`}>
                      {donation.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(donation.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-primary hover:text-primary-dark">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-accent hover:text-accent-dark">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expenditures Section */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-text-dark">Recent Expenditures</h3>
            <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Plus className="h-4 w-4" />
              <span>Add Expenditure</span>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {expenditures.map((expenditure) => (
              <motion.div
                key={expenditure.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-text-dark">{expenditure.title}</h4>
                      <p className="text-sm text-gray-600">{expenditure.description}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500">
                          {getProjectName(expenditure.projectId)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(expenditure.date).toLocaleDateString()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium bg-primary-light/10 text-primary`}>
                          {expenditure.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-text-dark">
                    ${expenditure.amount.toLocaleString()}
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

export default DonationTracking;