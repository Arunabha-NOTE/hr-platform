'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../app/types/enums/enums';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldX } from 'lucide-react';

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
        <Card className="w-96">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <CardTitle>Loading...</CardTitle>
            <CardDescription>Please wait while we verify your access</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (user && !allowedRoles.includes(user.role as Role)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <ShieldX className="mx-auto h-12 w-12 text-destructive mb-4" />
            <CardTitle className="text-destructive">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Alert className="mb-4">
              <AlertDescription>
                Redirecting you to your dashboard...
              </AlertDescription>
            </Alert>
            <Button
              onClick={() => router.push(getUserDashboardRoute(user.role as Role))}
              className="w-full"
            >
              Go to My Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
