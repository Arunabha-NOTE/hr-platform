'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import { LogOut, Users, Settings, BarChart3, UserPlus, Building, FileText, Calendar } from 'lucide-react';

const AdminDashboard = () => {
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
        <header className="bg-purple-600 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-white" />
                <h1 className="text-xl font-bold text-white">Admin Portal</h1>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="text-white text-sm">
                    <div className="font-medium">{user?.sub}</div>
                    <div className="text-purple-200">Organization Administrator</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-white hover:bg-purple-700 rounded-md transition-colors"
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
                Organization Management
              </h2>
              <p className="text-gray-600">
                Manage your organization's employees, departments, and operations
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Employees</p>
                    <p className="text-2xl font-semibold text-gray-900">156</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Building className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Departments</p>
                    <p className="text-2xl font-semibold text-gray-900">8</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calendar className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Pending Requests</p>
                    <p className="text-2xl font-semibold text-gray-900">12</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Attendance Rate</p>
                    <p className="text-2xl font-semibold text-green-600">94%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <UserPlus className="h-6 w-6 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Employee Management</h3>
                </div>
                <p className="text-gray-600 mb-4">Add, edit, and manage employee records</p>
                <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                  Manage Employees →
                </button>
              </div>

              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Building className="h-6 w-6 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Departments</h3>
                </div>
                <p className="text-gray-600 mb-4">Manage departments and organizational structure</p>
                <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                  Manage Departments →
                </button>
              </div>

              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <FileText className="h-6 w-6 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Reports</h3>
                </div>
                <p className="text-gray-600 mb-4">Generate and view organizational reports</p>
                <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                  View Reports →
                </button>
              </div>

              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Calendar className="h-6 w-6 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Leave Management</h3>
                </div>
                <p className="text-gray-600 mb-4">Manage employee leave requests and policies</p>
                <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                  Manage Leaves →
                </button>
              </div>

              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
                </div>
                <p className="text-gray-600 mb-4">View organizational analytics and insights</p>
                <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                  View Analytics →
                </button>
              </div>

              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Settings className="h-6 w-6 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
                </div>
                <p className="text-gray-600 mb-4">Configure organization settings and preferences</p>
                <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                  Organization Settings →
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
