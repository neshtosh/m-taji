import React, { useState, useEffect } from 'react';
import { authUtils, userProfileUtils } from '../../lib/auth';

const AuthDebugger: React.FC = () => {
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [cacheInfo, setCacheInfo] = useState<any>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateInfo = async () => {
      try {
        const [session, cache] = await Promise.all([
          authUtils.getSessionInfo(),
          Promise.resolve(userProfileUtils.getCacheInfo())
        ]);
        setSessionInfo(session);
        setCacheInfo(cache);
        setError(null);
      } catch (err) {
        console.error('Error getting debug info:', err);
        setError('Failed to get debug info');
      }
    };

    updateInfo();
    const interval = setInterval(updateInfo, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Only show in development
  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-mono"
      >
        Auth Debug
      </button>
      
      {showDebug && (
        <div className="absolute bottom-full right-0 mb-2 bg-gray-900 text-white p-4 rounded-lg text-xs font-mono max-w-sm">
          <div className="space-y-2">
            {error && (
              <div className="text-red-400">
                <strong>Error:</strong> {error}
              </div>
            )}
            
            {sessionInfo && (
              <div>
                <strong>Session Info:</strong>
                <div>Valid: {sessionInfo.session?.isValid ? 'Yes' : 'No'}</div>
                <div>Stored: {sessionInfo.stored}</div>
                <div>User ID: {sessionInfo.session?.userId || 'None'}</div>
                <div>Expires: {sessionInfo.session?.expiresAt ? new Date(sessionInfo.session.expiresAt * 1000).toLocaleTimeString() : 'N/A'}</div>
              </div>
            )}
            
            {cacheInfo && (
              <div>
                <strong>Profile Cache:</strong>
                <div>Exists: {cacheInfo.exists ? 'Yes' : 'No'}</div>
                {cacheInfo.exists && (
                  <>
                    <div>User ID: {cacheInfo.userId}</div>
                    <div>Age: {cacheInfo.age} min</div>
                    <div>Expired: {cacheInfo.isExpired ? 'Yes' : 'No'}</div>
                    <div>Version: {cacheInfo.version}</div>
                  </>
                )}
                {cacheInfo.error && (
                  <div className="text-red-400">Error: {cacheInfo.error}</div>
                )}
              </div>
            )}
            
            <div>
              <strong>Storage:</strong>
              <div>localStorage: {typeof window !== 'undefined' ? 'Available' : 'Not available'}</div>
              <div>BroadcastChannel: {typeof BroadcastChannel !== 'undefined' ? 'Available' : 'Not available'}</div>
            </div>
          </div>
          
          <div className="mt-3 space-y-1">
            <button
              onClick={() => {
                try {
                  authUtils.clearStoredSession();
                  userProfileUtils.clearUserProfile();
                  window.location.reload();
                } catch (err) {
                  console.error('Error clearing data:', err);
                  setError('Failed to clear data');
                }
              }}
              className="w-full bg-red-600 text-white px-2 py-1 rounded text-xs"
            >
              Clear All & Reload
            </button>
            
            <button
              onClick={() => {
                try {
                  userProfileUtils.clearUserProfile();
                  setCacheInfo(userProfileUtils.getCacheInfo());
                } catch (err) {
                  console.error('Error clearing profile cache:', err);
                  setError('Failed to clear profile cache');
                }
              }}
              className="w-full bg-yellow-600 text-white px-2 py-1 rounded text-xs"
            >
              Clear Profile Cache
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthDebugger;
