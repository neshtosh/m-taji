import React from 'react';

const CompletedProjects: React.FC = () => {
  const completedProjects = [
    {
      id: 1,
      name: 'Clean Water Initiative',
      targetFunds: 'KSh 200,000',
      actualFunds: 'KSh 250,000',
      summary: 'Provided clean drinking water to 3 rural communities through borehole installation and water purification systems.',
      completionDate: '2024-01-15',
      impact: '500+ lives improved'
    },
    {
      id: 2,
      name: 'Youth Leadership Camp',
      targetFunds: 'KSh 150,000',
      actualFunds: 'KSh 180,000',
      summary: 'Organized leadership training for 50 youth leaders focusing on environmental stewardship and community development.',
      completionDate: '2023-12-10',
      impact: '50 youth empowered'
    },
    {
      id: 3,
      name: 'Waste Management Program',
      targetFunds: 'KSh 100,000',
      actualFunds: 'KSh 95,000',
      summary: 'Implemented recycling programs in 5 schools and established community waste collection points.',
      completionDate: '2023-11-20',
      impact: '2,000+ students reached'
    },
    {
      id: 4,
      name: 'Solar Energy Project',
      targetFunds: 'KSh 300,000',
      actualFunds: 'KSh 320,000',
      summary: 'Installed solar panels in community centers providing renewable energy to 200 households.',
      completionDate: '2023-10-05',
      impact: '200 households benefited'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-200">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Completed Projects</h2>
      
      <div className="space-y-4">
        {completedProjects.map((project) => (
          <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-900 text-sm">{project.name}</h3>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                ✅ Completed
              </span>
            </div>
            
            <div className="space-y-2 mb-3">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Target:</span>
                <span className="font-medium">{project.targetFunds}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Raised:</span>
                <span className="font-medium text-green-600">{project.actualFunds}</span>
              </div>
            </div>
            
            <p className="text-xs text-gray-700 mb-3 leading-relaxed">
              {project.summary}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {new Date(project.completionDate).toLocaleDateString()}
              </span>
              <span className="text-xs font-medium text-amber-600">
                {project.impact}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <button className="text-sm text-amber-600 hover:text-amber-800 font-medium">
          View All Projects →
        </button>
      </div>
    </div>
  );
};

export default CompletedProjects; 