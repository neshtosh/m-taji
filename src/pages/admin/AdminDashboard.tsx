import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  Settings, 
  FileText,
  ShoppingBag,
  MessageSquare,
  Plus,
  TrendingUp,
  Target,
  CreditCard,
  Calendar
} from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import DashboardOverview from '../../components/admin/DashboardOverview';
import ProjectManagement from '../../components/admin/ProjectManagement';
import DonationTracking from '../../components/admin/DonationTracking';
import Analytics from '../../components/admin/Analytics';
import UserManagement from '../../components/admin/UserManagement';
import ContentManagement from '../../components/admin/ContentManagement';
import CampaignManagement from '../../components/admin/CampaignManagement';

type DashboardSection = 
  | 'overview' 
  | 'projects' 
  | 'donations' 
  | 'analytics' 
  | 'users' 
  | 'content' 
  | 'campaigns'
  | 'blog'
  | 'store'
  | 'microblog';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'projects', label: 'Projects', icon: Target },
    { id: 'donations', label: 'Donations', icon: DollarSign },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'campaigns', label: 'Campaigns', icon: Calendar },
    { id: 'blog', label: 'Blog', icon: FileText },
    { id: 'store', label: 'Store', icon: ShoppingBag },
    { id: 'microblog', label: 'Microblog', icon: MessageSquare },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview />;
      case 'projects':
        return <ProjectManagement />;
      case 'donations':
        return <DonationTracking />;
      case 'analytics':
        return <Analytics />;
      case 'users':
        return <UserManagement />;
      case 'content':
        return <ContentManagement />;
      case 'campaigns':
        return <CampaignManagement />;
      case 'blog':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-text-dark">Blog Management</h2>
                <p className="text-gray-600">Manage blog posts and articles</p>
              </div>
              <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-full flex items-center space-x-2 transition-colors">
                <Plus className="h-5 w-5" />
                <span>New Post</span>
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-dark mb-2">Blog Management</h3>
              <p className="text-gray-600">Create and manage blog posts, articles, and knowledge content.</p>
            </div>
          </div>
        );
      case 'store':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-text-dark">Merchandise Store</h2>
                <p className="text-gray-600">Manage products and orders</p>
              </div>
              <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-full flex items-center space-x-2 transition-colors">
                <Plus className="h-5 w-5" />
                <span>Add Product</span>
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-dark mb-2">Store Management</h3>
              <p className="text-gray-600">Manage merchandise, products, and e-commerce functionality.</p>
            </div>
          </div>
        );
      case 'microblog':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-text-dark">Microblog Feed</h2>
                <p className="text-gray-600">Manage community posts and announcements</p>
              </div>
              <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-full flex items-center space-x-2 transition-colors">
                <Plus className="h-5 w-5" />
                <span>New Post</span>
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-dark mb-2">Microblog Management</h3>
              <p className="text-gray-600">Create and manage community posts, events, and announcements.</p>
            </div>
          </div>
        );
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        navigationItems={navigationItems}
      />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;