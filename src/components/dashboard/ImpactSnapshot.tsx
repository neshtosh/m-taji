import React from 'react';

const ImpactSnapshot: React.FC = () => {
  const stats = [
    {
      title: 'Followers',
      value: '2,430',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Active Projects',
      value: '5',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      ),
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Funds Raised',
      value: 'KSh 450,000',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      ),
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    },
    {
      title: 'Lives Impacted',
      value: '1,240',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
      ),
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Impact Snapshot</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`${stat.bgColor} rounded-lg p-4 border ${stat.borderColor} hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                  <span className="text-white">{stat.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-sm text-gray-700">New project "Tree Planting Initiative" launched</p>
            <span className="text-xs text-gray-500 ml-auto">2h ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <p className="text-sm text-gray-700">Reached 100 new followers this week</p>
            <span className="text-xs text-gray-500 ml-auto">1d ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <p className="text-sm text-gray-700">Fundraising goal achieved for "Clean Water Project"</p>
            <span className="text-xs text-gray-500 ml-auto">3d ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactSnapshot; 