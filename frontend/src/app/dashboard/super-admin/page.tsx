'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { RoleProtectedRoute } from '../../../components/RoleProtectedRoute';
import { Role } from '../../types/enums/enums';
import { LogOut, Shield, Users, Settings, BarChart3, Database, UserCog, Globe } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const SuperAdminDashboard = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const stats = [
    { title: "Total Users", value: "1,234", icon: Users, trend: "+12%" },
    { title: "Organizations", value: "45", icon: Globe, trend: "+3%" },
    { title: "System Health", value: "Healthy", icon: Database, trend: "99.9%" },
    { title: "Active Sessions", value: "89", icon: BarChart3, trend: "+5%" },
  ];

  const actionCards = [
    { title: "User Management", description: "Manage all system users, roles, and permissions", icon: UserCog },
    { title: "Organizations", description: "Manage organizations and their configurations", icon: Globe },
    { title: "System Settings", description: "Configure system-wide settings and preferences", icon: Settings },
    { title: "Analytics", description: "View system analytics and performance metrics", icon: BarChart3 },
    { title: "System Health", description: "Monitor system health and performance", icon: Database },
    { title: "Security", description: "Manage security settings and audit logs", icon: Shield },
  ];

  return (
    <RoleProtectedRoute allowedRoles={[Role.SUPER_ADMIN]}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-8 w-8 text-destructive" />
                  <h1 className="text-xl font-bold">Super Admin Portal</h1>
                </div>
                <Badge variant="destructive">System Administrator</Badge>
              </div>

              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-destructive text-destructive-foreground">
                          {user?.sub?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user?.sub}</p>
                        <p className="text-xs text-muted-foreground">Super Administrator</p>
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
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto py-6 px-4 lg:px-8">
          <div className="space-y-8">
            {/* Page Header */}
            <div>
              <h2 className="text-3xl font-bold tracking-tight">System Administration</h2>
              <p className="text-muted-foreground">
                Manage the entire HR platform system, users, and configurations
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                      <IconComponent className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-green-600">{stat.trend}</span> from last month
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Action Cards */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {actionCards.map((card, index) => {
                  const IconComponent = card.icon;
                  return (
                    <Card key={index} className="cursor-pointer transition-all hover:shadow-md">
                      <CardHeader>
                        <div className="flex items-center space-x-2">
                          <IconComponent className="h-5 w-5 text-destructive" />
                          <CardTitle className="text-lg">{card.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="mb-4">{card.description}</CardDescription>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          Manage →
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </RoleProtectedRoute>
  );
};

export default SuperAdminDashboard;
