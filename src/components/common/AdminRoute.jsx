// components/common/AdminRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import { Loader2, Shield, AlertCircle, Lock } from 'lucide-react';

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useContext(AuthContext);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show login prompt
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <Lock className="w-16 h-16 text-[#79300f] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to access the admin panel.
          </p>
          <div className="space-y-3">
            <a 
              href="/login" 
              className="block w-full bg-gradient-to-r from-[#79300f] to-[#b14527] text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
            >
              Login to Continue
            </a>
            <a 
              href="/" 
              className="block w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200"
            >
              Go Back Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  // If user is authenticated but not admin, show access denied
  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="relative mb-4">
            <Shield className="w-16 h-16 text-gray-300 mx-auto" />
            <AlertCircle className="w-8 h-8 text-red-500 absolute -top-1 -right-1" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-2">
            You don't have admin privileges to access this page.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Contact your administrator if you believe this is an error.
          </p>
          <div className="space-y-3">
            <a 
              href="/" 
              className="block w-full bg-gradient-to-r from-[#79300f] to-[#b14527] text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
            >
              Go Back Home
            </a>
            <div className="text-xs text-gray-400 mt-4">
              Logged in as: <span className="font-medium">{user?.username}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If user is authenticated and is admin, render the admin component
  return children;
};

export default AdminRoute;