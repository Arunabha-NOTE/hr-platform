'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { RoleProtectedRoute } from '../../../components/RoleProtectedRoute';
import { Role } from '../../types/enums/enums';
import { LogOut, User, Calendar, FileText, Clock, DollarSign, Award, Bell } from 'lucide-react';

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <RoleProtectedRoute allowedRoles={[Role.EMPLOYEE]}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-green-600 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <User className="h-8 w-8 text-white" />
                <h1 className="text-xl font-bold text-white">Employee Portal</h1>
              </div>

              <div className="flex items-center space-x-4">
                <button className="p-2 text-white hover:text-green-200">
                  <Bell className="h-5 w-5" />
                </button>
                <div className="flex items-center space-x-3">
                  <div className="text-white text-sm">
                    <div className="font-medium">{user?.sub}</div>
                    <div className="text-green-200">Team Member</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-white hover:bg-green-700 rounded-md transition-colors"
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
                Welcome Back!
              </h2>
              <p className="text-gray-600">
                Your personal dashboard for managing your work and career
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calendar className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Leave Balance</p>
                    <p className="text-2xl font-semibold text-gray-900">18 days</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Hours This Week</p>
                    <p className="text-2xl font-semibold text-gray-900">38.5</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Award className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Performance</p>
                    <p className="text-2xl font-semibold text-green-600">Excellent</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Next Payroll</p>
                    <p className="text-2xl font-semibold text-gray-900">5 days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Clock className="h-6 w-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Time Tracking</h3>
                </div>
                <p className="text-gray-600 mb-4">Clock in/out and track your working hours</p>
                <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                  Track Time →
                </button>
              </div>

              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Calendar className="h-6 w-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Leave Request</h3>
                </div>
                <p className="text-gray-600 mb-4">Request time off and manage your leave balance</p>
                <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                  Request Leave →
                </button>
              </div>

              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <DollarSign className="h-6 w-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Payroll</h3>
                </div>
                <p className="text-gray-600 mb-4">View payslips and salary information</p>
                <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                  View Payroll →
                </button>
              </div>

              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <User className="h-6 w-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">My Profile</h3>
                </div>
                <p className="text-gray-600 mb-4">Update your personal information and settings</p>
                <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                  Edit Profile →
                </button>
              </div>

              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Award className="h-6 w-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
                </div>
                <p className="text-gray-600 mb-4">View your performance reviews and goals</p>
                <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                  View Performance →
                </button>
              </div>

              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <FileText className="h-6 w-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
                </div>
                <p className="text-gray-600 mb-4">Access your employment documents and contracts</p>
                <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                  View Documents →
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </RoleProtectedRoute>
  );
};

export default EmployeeDashboard;
