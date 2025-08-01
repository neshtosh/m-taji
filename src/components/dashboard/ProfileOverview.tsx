import React from 'react';

const ProfileOverview: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-200">
      <div className="text-center">
        {/* Circular Profile Image */}
        <div className="mx-auto mb-4">
          <div className="w-24 h-24 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
        </div>

        {/* User Details */}
        <h2 className="text-xl font-bold text-gray-900 mb-1">Amina Kiptoo</h2>
        <p className="text-amber-600 font-semibold mb-2">Environmental Advocate</p>
        <p className="text-gray-600 text-sm mb-4 flex items-center justify-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          Nairobi, Kenya
        </p>

        {/* Mission Statement */}
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
          <h3 className="text-sm font-semibold text-amber-800 mb-2">My Mission</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            "Empowering communities through sustainable environmental initiatives and youth leadership development. 
            Committed to creating lasting positive impact in our local ecosystem."
          </p>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-600">3</p>
            <p className="text-xs text-gray-600">Years Active</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-600">12</p>
            <p className="text-xs text-gray-600">Projects Led</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview; 