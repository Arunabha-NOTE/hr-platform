'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { RoleProtectedRoute } from '../../../components/RoleProtectedRoute';
import { Role } from '../../types/enums/enums';
import { LogOut, Shield, Users, Settings, BarChart3, Database, UserCog, Globe } from 'lucide-react';

const SuperAdminDashboard = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <RoleProtectedRoute allowedRoles={[Role.SUPER_ADMIN]}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-red-600 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-white" />
                <h1 className="text-xl font-bold text-white">Super Admin Portal</h1>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="text-white text-sm">
                    <div className="font-medium">{user?.sub}</div>
                    <div className="text-red-200">Super Administrator</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-white hover:bg-red-700 rounded-md transition-colors"
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
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                System Administration
              </h2>
              <p className="text-gray-600">
                Manage the entire HR platform system, users, and configurations
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Users</p>
                    <p className="text-2xl font-semibold text-gray-900">1,234</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Globe className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Organizations</p>
                    <p className="text-2xl font-semibold text-gray-900">45</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Database className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">System Health</p>
                    <p className="text-2xl font-semibold text-green-600">Healthy</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BarChart3 className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Active Sessions</p>
                    <p className="text-2xl font-semibold text-gray-900">89</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <UserCog className="h-6 w-6 text-red-600" />
                  <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                </div>
                <p className="text-gray-600 mb-4">Manage all system users, roles, and permissions</p>
                <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                  Manage Users →
                </button>
              </div>

              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Globe className="h-6 w-6 text-red-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Organizations</h3>
                </div>
                <p className="text-gray-600 mb-4">Manage organizations and their configurations</p>
                <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                  Manage Organizations →
                </button>
              </div>

              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Settings className="h-6 w-6 text-red-600" />
                  <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
                </div>
                <p className="text-gray-600 mb-4">Configure system-wide settings and preferences</p>
                <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                  System Settings →
                </button>
              </div>

              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <BarChart3 className="h-6 w-6 text-red-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
                </div>
                <p className="text-gray-600 mb-4">View system analytics and performance metrics</p>
                <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                  View Analytics →
                </button>
              </div>

              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Database className="h-6 w-6 text-red-600" />
                  <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
                </div>
                <p className="text-gray-600 mb-4">Monitor system health and performance</p>
                <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                  View Health →
                </button>
              </div>

              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Shield className="h-6 w-6 text-red-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Security</h3>
                </div>
                <p className="text-gray-600 mb-4">Manage security settings and audit logs</p>
                <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                  Security Center →
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </RoleProtectedRoute>
  );
};

export default SuperAdminDashboard;
