'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../app/types/enums/enums';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  redirectTo?: string;
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      if (user && !allowedRoles.includes(user.role as Role)) {
        // Redirect to user's appropriate dashboard based on their role
        const userDashboard = getUserDashboardRoute(user.role as Role);
        if (redirectTo) {
          router.push(redirectTo);
        } else {
          router.push(userDashboard);
        }
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, router, redirectTo]);

  const getUserDashboardRoute = (role: Role): string => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (user && !allowedRoles.includes(user.role as Role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <p className="text-sm text-gray-500">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
