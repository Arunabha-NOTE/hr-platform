'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { RoleProtectedRoute } from '../../../components/RoleProtectedRoute';
import { Role } from '../../types/enums/enums';
import {
  LogOut,
  Users,
  UserPlus,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  RefreshCw,
  Shield,
  UserCog
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Import the user API
import { adminApi } from '../../../lib/api';

interface User {
  id: number;
  email: string;
  role: string;
  firstLogin: boolean;
  active?: boolean;
  organization?: {
    id: number;
    name: string;
  };
}

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [organizationName, setOrganizationName] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    managers: 0,
    employees: 0,
    activeUsers: 0
  });

  useEffect(() => {
    fetchOrganizationUsers();
  }, []);

  const fetchOrganizationUsers = async () => {
    try {
      setLoading(true);
      // Use admin API to get organization-specific users
      const orgUsers = await adminApi.getOrganizationUsers();

      // Filter to only show MANAGER and EMPLOYEE roles (backend should handle org filtering)
      const filteredUsers = orgUsers.filter(u =>
        u.role === 'MANAGER' || u.role === 'EMPLOYEE'
      );

      setUsers(filteredUsers);

      const managers = filteredUsers.filter(u => u.role === 'MANAGER').length;
      const employees = filteredUsers.filter(u => u.role === 'EMPLOYEE').length;
      const activeUsers = filteredUsers.filter(u => !u.firstLogin).length;

      setStats({
        totalUsers: filteredUsers.length,
        managers,
        employees,
        activeUsers
      });

      if (filteredUsers.length > 0 && filteredUsers[0].organization) {
        setOrganizationName(filteredUsers[0].organization.name);
      } else {
        setOrganizationName('Your Organization');
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setError('Failed to load organization users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleAddUser = async () => {
    if (!formData.email || !formData.password || !formData.role) {
      setError('All fields are required');
      return;
    }

    if (formData.role !== 'MANAGER' && formData.role !== 'EMPLOYEE') {
      setError('Invalid role selected');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      // Use admin API (no need to specify organizationId as backend handles it)
      await adminApi.createUser({
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      setIsAddDialogOpen(false);
      resetForm();
      await fetchOrganizationUsers();
    } catch (error: any) {
      console.error('Error creating user:', error);
      setError('Failed to create user. Email might already exist.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser || !formData.email || !formData.role) {
      setError('All fields are required');
      return;
    }

    if (formData.role !== 'MANAGER' && formData.role !== 'EMPLOYEE') {
      setError('Invalid role selected');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await adminApi.updateUser(selectedUser.id, {
        email: formData.email,
        role: formData.role,
        active: true
      });
      setIsEditDialogOpen(false);
      resetForm();
      await fetchOrganizationUsers();
    } catch (error: any) {
      console.error('Error updating user:', error);
      setError('Failed to update user.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      setSubmitting(true);
      await adminApi.deleteUser(selectedUser.id);
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      await fetchOrganizationUsers();
    } catch (error) {
      setError('Failed to delete user.');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setFormData({
      email: user.email || '',
      password: '',
      role: user.role || ''
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      role: ''
    });
    setError('');
    setSelectedUser(null);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'MANAGER': return 'default';
      case 'EMPLOYEE': return 'outline';
      default: return 'outline';
    }
  };

  const statsData = [
    {
      title: "Total Users",
      value: loading ? "..." : stats.totalUsers.toString(),
      icon: Users,
      description: `${stats.activeUsers} active users`,
    },
    {
      title: "Managers",
      value: loading ? "..." : stats.managers.toString(),
      icon: UserCog,
      description: "Management staff",
    },
    {
      title: "Employees",
      value: loading ? "..." : stats.employees.toString(),
      icon: Users,
      description: "Team members",
    },
  ];

  return (
    <RoleProtectedRoute allowedRoles={[Role.ADMIN]}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-8 w-8 text-blue-600" />
                  <h1 className="text-xl font-bold">
                    {organizationName} Admin Portal
                  </h1>
                </div>
                <Badge variant="secondary">Administrator</Badge>
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
                      <p className="text-xs text-muted-foreground">Administrator</p>
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
              <h2 className="text-3xl font-bold tracking-tight">
                Organization Dashboard
              </h2>
              <p className="text-muted-foreground">
                Manage users and monitor your organization
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-3">
              {statsData.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {loading ? <Skeleton className="h-8 w-16" /> : stat.value}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Management Cards */}
            <div className="grid gap-6 md:grid-cols-1">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <UserCog className="h-5 w-5" />
                        User Management
                      </CardTitle>
                      <CardDescription>
                        Manage managers and employees in your organization
                      </CardDescription>
                    </div>
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    <Button variant="outline" size="sm" onClick={fetchOrganizationUsers}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
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
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
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
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => openEditDialog(user)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => openDeleteDialog(user)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredUsers.length === 0 && !loading && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground">
                              No users found in your organization
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}

                  {!loading && filteredUsers.length === 0 && (
                    <div className="text-center py-8">
                      <UserPlus className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold">No users found</h3>
                      <p className="text-muted-foreground">
                        {searchTerm ? 'No users match your search.' : 'Get started by adding your first user.'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        {/* Add User Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account for your organization.
              </DialogDescription>
            </DialogHeader>

            {error && (
              <Alert>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MANAGER">Manager</SelectItem>
                    <SelectItem value="EMPLOYEE">Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser} disabled={submitting}>
                {submitting ? 'Creating...' : 'Create User'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user information.
              </DialogDescription>
            </DialogHeader>

            {error && (
              <Alert>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MANAGER">Manager</SelectItem>
                    <SelectItem value="EMPLOYEE">Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditUser} disabled={submitting}>
                {submitting ? 'Updating...' : 'Update User'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete User Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete User</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this user? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteUser} disabled={submitting}>
                {submitting ? 'Deleting...' : 'Delete User'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </RoleProtectedRoute>
  );
};

export default AdminDashboard;
