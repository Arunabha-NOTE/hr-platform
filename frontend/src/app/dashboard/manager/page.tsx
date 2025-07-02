'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { RoleProtectedRoute } from '../../../components/RoleProtectedRoute';
import { Role } from '../../types/enums/enums';
import { LogOut, UserCheck, Users, Calendar, FileText, Clock, Target, TrendingUp } from 'lucide-react';

const ManagerDashboard = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <RoleProtectedRoute allowedRoles={[Role.MANAGER]}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-blue-600 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <UserCheck className="h-8 w-8 text-white" />
                <h1 className="text-xl font-bold text-white">Manager Portal</h1>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="text-white text-sm">
                    <div className="font-medium">{user?.sub}</div>
                    <div className="text-blue-200">Team Manager</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-white hover:bg-blue-700 rounded-md transition-colors"
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
                Team Management
              </h2>
              <p className="text-gray-600">
                Manage your team, track performance, and handle team operations
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Team Members</p>
                    <p className="text-2xl font-semibold text-gray-900">24</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Goals Achieved</p>
                    <p className="text-2xl font-semibold text-gray-900">18/20</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calendar className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Leave Requests</p>
                    <p className="text-2xl font-semibold text-gray-900">5</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Team Performance</p>
                    <p className="text-2xl font-semibold text-green-600">92%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Team Overview</h3>
                </div>
                <p className="text-gray-600 mb-4">View and manage your team members</p>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  View Team →
                </button>
              </div>

              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Target className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Performance Review</h3>
                </div>
                <p className="text-gray-600 mb-4">Review team performance and set goals</p>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Performance Review →
                </button>
              </div>

              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Calendar className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Leave Management</h3>
                </div>
                <p className="text-gray-600 mb-4">Approve or decline leave requests</p>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Manage Leaves →
                </button>
              </div>

              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Clock className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Time Tracking</h3>
                </div>
                <p className="text-gray-600 mb-4">Track team hours and attendance</p>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Time Tracking →
                </button>
              </div>

              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Reports</h3>
                </div>
                <p className="text-gray-600 mb-4">Generate team reports and analytics</p>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  View Reports →
                </button>
              </div>

              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Team Analytics</h3>
                </div>
                <p className="text-gray-600 mb-4">View team performance metrics</p>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  View Analytics →
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </RoleProtectedRoute>
  );
};

export default ManagerDashboard;
