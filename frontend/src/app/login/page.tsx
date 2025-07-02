'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Lock, Mail, AlertCircle, Shield, Users, UserCheck, User } from 'lucide-react';
import { Role } from '../types/enums/enums';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

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
      color: 'destructive',
      description: 'System Administrator'
    },
    [Role.ADMIN]: {
      label: 'Admin',
      icon: Users,
      color: 'secondary',
      description: 'Organization Administrator'
    },
    [Role.MANAGER]: {
      label: 'Manager',
      icon: UserCheck,
      color: 'default',
      description: 'Team Manager'
    },
    [Role.EMPLOYEE]: {
      label: 'Employee',
      icon: User,
      color: 'outline',
      description: 'Team Member'
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardRoute = getRoleDashboardRoute(user.role);
      router.push(dashboardRoute);
    }
  }, [isAuthenticated, user, router]);

  const getRoleDashboardRoute = (role: Role | string): string => {
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
      console.log('Attempting login with:', { email, password: '***', selectedRole });
      await login(email, password);
      console.log('Login successful, redirecting...');
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 bg-primary rounded-full flex items-center justify-center">
            <Lock className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Sign in to your account</h1>
          <p className="text-muted-foreground">Welcome back to HR Platform</p>
        </div>

        {/* Main Login Card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Select Your Role</CardTitle>
            <CardDescription>Choose your role to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(roleConfigs).map(([roleKey, config]) => {
                const role = roleKey as Role;
                const IconComponent = config.icon;
                const isSelected = selectedRole === role;
                return (
                  <Button
                    key={roleKey}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "h-auto p-4 flex-col space-y-2",
                      isSelected && "ring-2 ring-primary ring-offset-2"
                    )}
                    onClick={() => setSelectedRole(role)}
                  >
                    <IconComponent className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-medium">{config.label}</div>
                      <div className="text-xs opacity-70">{config.description}</div>
                    </div>
                  </Button>
                );
              })}
            </div>

            {/* Selected Role Badge */}
            <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
              <Badge variant={roleConfigs[selectedRole].color as any}>
                {React.createElement(roleConfigs[selectedRole].icon, { className: "h-4 w-4 mr-1" })}
                {roleConfigs[selectedRole].label}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {roleConfigs[selectedRole].description}
              </span>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-9"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    Signing in...
                  </>
                ) : (
                  `Sign in as ${roleConfigs[selectedRole].label}`
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Having trouble signing in?{' '}
            <Button variant="link" className="p-0 h-auto font-medium">
              Contact support
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
