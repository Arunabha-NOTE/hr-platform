'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { RoleProtectedRoute } from '../../../components/RoleProtectedRoute';
import { Role } from '../../types/enums/enums';
import { LogOut, UserCheck, Users, Calendar, FileText, Clock, Target, TrendingUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const ManagerDashboard = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const stats = [
    { title: "Team Members", value: "24", icon: Users, trend: "+2%" },
    { title: "Goals Achieved", value: "18/20", icon: Target, trend: "+10%" },
    { title: "Leave Requests", value: "5", icon: Calendar, trend: "+1%" },
    { title: "Team Performance", value: "92%", icon: TrendingUp, trend: "+5%" },
  ];

  const actionCards = [
    { title: "Team Overview", description: "View and manage your team members", icon: Users },
    { title: "Performance Review", description: "Review team performance and set goals", icon: Target },
    { title: "Leave Management", description: "Approve or decline leave requests", icon: Calendar },
    { title: "Time Tracking", description: "Track team hours and attendance", icon: Clock },
    { title: "Reports", description: "Generate team reports and analytics", icon: FileText },
    { title: "Team Analytics", description: "View team performance metrics", icon: TrendingUp },
  ];

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
                  <h1 className="text-xl font-bold">Manager Portal</h1>
                </div>
                <Badge variant="default">Team Manager</Badge>
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
                      <p className="text-xs text-muted-foreground">Team Manager</p>
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
            {/* Page Header */}
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Team Management</h2>
              <p className="text-muted-foreground">
                Manage your team, track performance, and handle team operations
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
                          <IconComponent className="h-5 w-5 text-blue-600" />
                          <CardTitle className="text-lg">{card.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="mb-4">{card.description}</CardDescription>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-600">
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

export default ManagerDashboard;
