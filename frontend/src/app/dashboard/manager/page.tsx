'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { RoleProtectedRoute } from '../../../components/RoleProtectedRoute';
import { Role } from '../../types/enums/enums';
import { LogOut, UserCheck, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Import the user API to fetch organization users
import { userApi } from '../../../lib/api';

interface User {
  id: number;
  email: string;
  role: string;
  firstLogin: boolean;
  organization?: {
    id: number;
    name: string;
  };
}

const ManagerDashboard = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [organizationName, setOrganizationName] = useState('');

  useEffect(() => {
    fetchOrganizationUsers();
  }, []);

  const fetchOrganizationUsers = async () => {
    try {
      setLoading(true);
      // For now, we'll fetch all users and filter by organization
      // In a real scenario, you'd have an API endpoint to get users by organization
      const allUsers = await userApi.getAll();

      // Filter users by the manager's organization
      // You'll need to get the manager's organization ID from the JWT token or user context
      const orgUsers = allUsers.filter(u => u.organization?.id === getManagerOrganizationId());

      setUsers(orgUsers);

      // Set organization name from the first user's organization
      if (orgUsers.length > 0 && orgUsers[0].organization) {
        setOrganizationName(orgUsers[0].organization.name);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setError('Failed to load organization users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get manager's organization ID
  // This should be extracted from the JWT token or user context
  const getManagerOrganizationId = () => {
    // TODO: Extract organization ID from JWT token or user context
    // For now, returning a placeholder - you'll need to implement this based on your auth structure
    return 1; // Replace with actual organization ID extraction
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'secondary';
      case 'MANAGER': return 'default';
      case 'EMPLOYEE': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <RoleProtectedRoute allowedRoles={[Role.MANAGER]}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <UserCheck className="h-8 w-8 text-blue-600" />
                  <h1 className="text-xl font-bold">
                    Welcome to {organizationName || 'Your Organization'} Portal
                  </h1>
                </div>
                <Badge variant="default">Manager</Badge>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-600 text-white">
                        {user?.sub?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.sub}</p>
                      <p className="text-xs text-muted-foreground">Manager</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto py-6 px-4 lg:px-8">
          <div className="space-y-8">
            {/* Total Users Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users in Organization</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? <Skeleton className="h-8 w-16" /> : users.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Users in {organizationName || 'your organization'}
                </p>
              </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle>Organization Users</CardTitle>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {loading ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={getRoleBadgeVariant(user.role)}>
                              {user.role.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.firstLogin ? 'outline' : 'default'}>
                              {user.firstLogin ? 'First Login Required' : 'Active'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      {users.length === 0 && !loading && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground">
                            No users found in your organization
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </RoleProtectedRoute>
  );
};

export default ManagerDashboard;
