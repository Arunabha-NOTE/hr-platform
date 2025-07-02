'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Lock, Mail, AlertCircle, Shield, Users, UserCheck, User } from 'lucide-react';
import { Role } from '../types/enums/enums';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>(Role.EMPLOYEE);

  const { login, isAuthenticated, user } = useAuth();
  const router = useRouter();

  // Role configurations
  const roleConfigs = {
    [Role.SUPER_ADMIN]: {
      label: 'Super Admin',
      icon: Shield,
      color: 'bg-red-600 text-white border-red-600',
      hoverColor: 'hover:bg-red-700',
      description: 'System Administrator'
    },
    [Role.ADMIN]: {
      label: 'Admin',
      icon: Users,
      color: 'bg-purple-600 text-white border-purple-600',
      hoverColor: 'hover:bg-purple-700',
      description: 'Organization Administrator'
    },
    [Role.MANAGER]: {
      label: 'Manager',
      icon: UserCheck,
      color: 'bg-blue-600 text-white border-blue-600',
      hoverColor: 'hover:bg-blue-700',
      description: 'Team Manager'
    },
    [Role.EMPLOYEE]: {
      label: 'Employee',
      icon: User,
      color: 'bg-green-600 text-white border-green-600',
      hoverColor: 'hover:bg-green-700',
      description: 'Team Member'
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on user role
      const dashboardRoute = getRoleDashboardRoute(user.role);
      router.push(dashboardRoute);
    }
  }, [isAuthenticated, user, router]);

  const getRoleDashboardRoute = (role: Role): string => {
    switch (role) {
      case Role.SUPER_ADMIN:
        return '/dashboard/super-admin';
      case Role.ADMIN:
        return '/dashboard/admin';
      case Role.MANAGER:
        return '/dashboard/manager';
      case Role.EMPLOYEE:
        return '/dashboard/employee';
      default:
        return '/dashboard';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      // Redirect will be handled by useEffect when user state updates
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setError(''); // Clear any existing errors when switching roles
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back to HR Platform
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="bg-white rounded-xl shadow-xl p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">Select Your Role</h3>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {Object.entries(roleConfigs).map(([role, config]) => {
              const IconComponent = config.icon;
              const isSelected = selectedRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleSelect(role as Role)}
                  className={`
                    p-3 rounded-lg border-2 transition-all duration-200 text-center
                    ${isSelected 
                      ? config.color 
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                    }
                    ${isSelected ? config.hoverColor : 'hover:bg-gray-50'}
                  `}
                >
                  <IconComponent className={`h-6 w-6 mx-auto mb-2 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                  <div className="text-sm font-medium">{config.label}</div>
                  <div className={`text-xs mt-1 ${isSelected ? 'text-white opacity-90' : 'text-gray-500'}`}>
                    {config.description}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            {/* Selected Role Indicator */}
            <div className="bg-gray-50 rounded-lg p-3 flex items-center space-x-3">
              <div className={`p-2 rounded-full ${roleConfigs[selectedRole].color}`}>
                {React.createElement(roleConfigs[selectedRole].icon, { className: "h-4 w-4" })}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Signing in as {roleConfigs[selectedRole].label}
                </div>
                <div className="text-xs text-gray-500">
                  {roleConfigs[selectedRole].description}
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`
                  group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white 
                  ${roleConfigs[selectedRole].color.replace('text-white border-', 'bg-').replace(' text-white', '')} 
                  ${roleConfigs[selectedRole].hoverColor} 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                `}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  `Sign in as ${roleConfigs[selectedRole].label}`
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Having trouble signing in?{' '}
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
