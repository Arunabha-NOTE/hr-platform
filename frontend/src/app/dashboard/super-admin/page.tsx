"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { RoleProtectedRoute } from "../../../components/RoleProtectedRoute";
import { Role } from "../../types/enums/enums";
import {
  LogOut,
  Shield,
  Users,
  UserCog,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { statsApi } from "../../../lib/api";

const SuperAdminDashboard = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrganizations: 0,
    activeUsers: 0,
    activeOrganizations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const dashboardStats = await statsApi.getDashboardStats();
        setStats(dashboardStats);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const statsData = [
    {
      title: "Total Users",
      value: loading ? "..." : stats.totalUsers.toString(),
      icon: Users,
      description: `${stats.activeUsers} active users`,
    },
    {
      title: "Total Organizations",
      value: loading ? "..." : stats.totalOrganizations.toString(),
      icon: Globe,
      description: `${stats.activeOrganizations} active organizations`,
    },
  ];

  const managementCards = [
    {
      title: "Manage Users",
      description: "Add, edit, and manage all system users and their roles",
      icon: UserCog,
      route: "/dashboard/super-admin/users",
    },
    {
      title: "Manage Organizations",
      description: "Create and manage organizations and their configurations",
      icon: Globe,
      route: "/dashboard/super-admin/organizations",
    },
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
                        <p className="text-xs text-muted-foreground">
                          Super Administrator
                        </p>
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
              <h2 className="text-3xl font-bold tracking-tight">
                System Administration
              </h2>
              <p className="text-muted-foreground">
                Manage the entire HR platform system, users, and organizations
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {statsData.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                      <IconComponent className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="space-y-2">
                          <Skeleton className="h-8 w-16" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      ) : (
                        <>
                          <div className="text-2xl font-bold">{stat.value}</div>
                          <p className="text-xs text-muted-foreground">
                            {stat.description}
                          </p>
                        </>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Management Cards */}
            <div>
              <h3 className="text-xl font-semibold mb-4">System Management</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {managementCards.map((card, index) => {
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
                        <CardDescription className="mb-4">
                          {card.description}
                        </CardDescription>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => router.push(card.route)}
                        >
                          Open Management →
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
