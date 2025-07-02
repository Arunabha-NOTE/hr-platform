'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { LogOut, User, Settings, Bell } from 'lucide-react';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">HR Platform</h1>
              </div>

              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-400 hover:text-gray-500">
                  <Bell className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-500">
                  <Settings className="h-5 w-5" />
                </button>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-8 w-8 text-gray-400" />
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{user?.sub}</div>
                      <div className="text-gray-500">{user?.role}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to HR Platform Dashboard
              </h2>
              <p className="text-gray-600 mb-6">
                You are logged in as: <span className="font-medium">{user?.sub}</span>
              </p>
              <p className="text-gray-600">
                Role: <span className="font-medium">{user?.role}</span>
              </p>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
