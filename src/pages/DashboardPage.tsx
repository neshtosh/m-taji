import React from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import ProfileOverview from '../components/dashboard/ProfileOverview';
import ImpactSnapshot from '../components/dashboard/ImpactSnapshot';
import CompletedProjects from '../components/dashboard/CompletedProjects';
import CreativeZone from '../components/dashboard/CreativeZone';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <DashboardHeader />
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Profile Overview */}
          <div className="lg:col-span-3">
            <ProfileOverview />
          </div>
          
          {/* Center Panel - Impact Snapshot */}
          <div className="lg:col-span-6">
            <ImpactSnapshot />
          </div>
          
          {/* Right Panel - Completed Projects */}
          <div className="lg:col-span-3">
            <CompletedProjects />
          </div>
        </div>
        
        {/* Bottom Panel - Creative Zone */}
        <div className="mt-8">
          <CreativeZone />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 