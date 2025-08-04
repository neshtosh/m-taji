import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Shield, 
  Bell, 
  Globe, 
  Palette, 
  Download, 
  Trash2, 
  Eye, 
  EyeOff,
  Mail,
  Phone,
  MapPin,
  Lock,
  Key,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    projectUpdates: true,
    fundingAlerts: true,
    communityNews: false
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    showLocation: true
  });

  const tabs = [
    { id: 'profile', name: 'Profile Settings', icon: User },
    { id: 'security', name: 'Security & Privacy', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'preferences', name: 'Preferences', icon: Palette },
    { id: 'account', name: 'Account', icon: Key }
  ];

  const handleSaveProfile = () => {
    // Handle profile save
    console.log('Profile saved');
  };

  const handleChangePassword = () => {
    // Handle password change
    console.log('Password changed');
  };

  const handleDeleteAccount = () => {
    // Handle account deletion
    console.log('Account deleted');
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white font-artistic italic mb-6">Personal Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
            <input 
              type="text" 
              defaultValue={user?.name || ''}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input 
              type="text" 
              defaultValue={user?.name?.toLowerCase().replace(/\s+/g, '') || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              defaultValue={user?.email || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input 
              type="tel" 
              defaultValue=""
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea 
              rows={3}
              defaultValue="Youth changemaker passionate about community development and sustainable innovation."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input 
              type="text" 
              defaultValue="Nairobi, Kenya"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Focus Area</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
              <option value="education">Education</option>
              <option value="health">Health & Sanitation</option>
              <option value="environment">Environment</option>
              <option value="agriculture">Agriculture</option>
              <option value="technology">Technology</option>
              <option value="economic">Economic Development</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <button 
            onClick={handleSaveProfile}
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Change Password</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent pr-10"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <input 
                type={showNewPassword ? "text" : "password"}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent pr-10"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showNewPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button 
            onClick={handleChangePassword}
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Change Password
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Privacy Settings</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
            <select 
              value={privacy.profileVisibility}
              onChange={(e) => setPrivacy({...privacy, profileVisibility: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="public">Public</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private</option>
            </select>
          </div>
          
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Contact Information</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={privacy.showEmail}
                  onChange={(e) => setPrivacy({...privacy, showEmail: e.target.checked})}
                  className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="ml-2 text-sm text-gray-700">Show email address</span>
              </label>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={privacy.showPhone}
                  onChange={(e) => setPrivacy({...privacy, showPhone: e.target.checked})}
                  className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="ml-2 text-sm text-gray-700">Show phone number</span>
              </label>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={privacy.showLocation}
                  onChange={(e) => setPrivacy({...privacy, showLocation: e.target.checked})}
                  className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="ml-2 text-sm text-gray-700">Show location</span>
              </label>
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Messages</label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={privacy.allowMessages}
                onChange={(e) => setPrivacy({...privacy, allowMessages: e.target.checked})}
                className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="ml-2 text-sm text-gray-700">Allow messages from other users</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Communication Channels</h4>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifications.email}
                  onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                  className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <div className="flex items-center">
                  <Smartphone className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="text-sm font-medium text-gray-700">Push Notifications</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifications.push}
                  onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                  className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="text-sm font-medium text-gray-700">SMS Notifications</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifications.sms}
                  onChange={(e) => setNotifications({...notifications, sms: e.target.checked})}
                  className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
              </label>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Notification Types</h4>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Project Updates</span>
                <input 
                  type="checkbox" 
                  checked={notifications.projectUpdates}
                  onChange={(e) => setNotifications({...notifications, projectUpdates: e.target.checked})}
                  className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Funding Alerts</span>
                <input 
                  type="checkbox" 
                  checked={notifications.fundingAlerts}
                  onChange={(e) => setNotifications({...notifications, fundingAlerts: e.target.checked})}
                  className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Community News</span>
                <input 
                  type="checkbox" 
                  checked={notifications.communityNews}
                  onChange={(e) => setNotifications({...notifications, communityNews: e.target.checked})}
                  className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Display Preferences</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Theme</h4>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => toggleTheme()}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                  theme === 'light' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-300 text-gray-700'
                }`}
              >
                <Sun className="h-4 w-4" />
                <span>Light Mode</span>
              </button>
              <button
                onClick={() => toggleTheme()}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                  theme === 'dark' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-300 text-gray-700'
                }`}
              >
                <Moon className="h-4 w-4" />
                <span>Dark Mode</span>
              </button>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Sound</h4>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700">
                <Volume2 className="h-4 w-4" />
                <span>Sound On</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700">
                <VolumeX className="h-4 w-4" />
                <span>Sound Off</span>
              </button>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Language</h4>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
              <option value="en">English</option>
              <option value="sw">Swahili</option>
              <option value="fr">French</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Account Actions</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Download className="h-5 w-5 text-blue-600" />
              <div>
                <h4 className="font-medium text-blue-900">Download Data</h4>
                <p className="text-sm text-blue-700">Get a copy of your data</p>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Download
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-yellow-600" />
              <div>
                <h4 className="font-medium text-yellow-900">Deactivate Account</h4>
                <p className="text-sm text-yellow-700">Temporarily disable your account</p>
              </div>
            </div>
            <button className="text-yellow-600 hover:text-yellow-700 font-medium">
              Deactivate
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Trash2 className="h-5 w-5 text-red-600" />
              <div>
                <h4 className="font-medium text-red-900">Delete Account</h4>
                <p className="text-sm text-red-700">Permanently delete your account and data</p>
              </div>
            </div>
            <button 
              onClick={handleDeleteAccount}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileSettings();
      case 'security':
        return renderSecuritySettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'preferences':
        return renderPreferences();
      case 'account':
        return renderAccountSettings();
      default:
        return renderProfileSettings();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-bold-rounded mb-2">Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your account preferences and privacy</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-700'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <tab.icon className="h-5 w-5" />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 