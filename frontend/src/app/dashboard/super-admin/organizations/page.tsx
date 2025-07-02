'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RoleProtectedRoute } from '../../../../components/RoleProtectedRoute';
import { Role } from '../../../types/enums/enums';
import {
  ArrowLeft,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  Building,
  RefreshCw,
  Users
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { organizationApi, userApi, Organization, CreateOrganizationRequest, UpdateOrganizationRequest } from '../../../../lib/api';

const OrganizationManagementPage = () => {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    active: true
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [orgsData, usersData] = await Promise.all([
        organizationApi.getAll(),
        userApi.getAll()
      ]);

      // Add user counts to organizations
      const orgsWithUserCounts = orgsData.map(org => ({
        ...org,
        userCount: usersData.filter(user => user.organization.id === org.id).length
      }));

      setOrganizations(orgsWithUserCounts);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (org.description && org.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddOrganization = async () => {
    if (!formData.name.trim()) {
      setError('Organization name is required');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const newOrg = await organizationApi.create({
        name: formData.name,
        description: formData.description
      });
      setOrganizations([...organizations, { ...newOrg, userCount: 0 }]);
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      setError('Failed to create organization. Name might already exist.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditOrganization = async () => {
    if (!selectedOrganization || !formData.name.trim()) {
      setError('Organization name is required');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const updatedOrg = await organizationApi.update(selectedOrganization.id, {
        name: formData.name,
        description: formData.description,
        active: formData.active
      });
      setOrganizations(organizations.map(org =>
        org.id === selectedOrganization.id
          ? { ...updatedOrg, userCount: selectedOrganization.userCount }
          : org
      ));
      setIsEditDialogOpen(false);
      resetForm();
    } catch (error) {
      setError('Failed to update organization.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteOrganization = async () => {
    if (!selectedOrganization) return;

    if (selectedOrganization.userCount && selectedOrganization.userCount > 0) {
      setError('Cannot delete organization with existing users. Please reassign or remove users first.');
      return;
    }

    try {
      setSubmitting(true);
      await organizationApi.delete(selectedOrganization.id);
      setOrganizations(organizations.filter(org => org.id !== selectedOrganization.id));
      setIsDeleteDialogOpen(false);
      setSelectedOrganization(null);
    } catch (error) {
      setError('Failed to delete organization.');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditDialog = (organization: Organization) => {
    setSelectedOrganization(organization);
    setFormData({
      name: organization.name,
      description: organization.description || '',
      active: organization.active
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (organization: Organization) => {
    setSelectedOrganization(organization);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      active: true
    });
    setError('');
    setSelectedOrganization(null);
  };

  return (
    <RoleProtectedRoute allowedRoles={[Role.SUPER_ADMIN]}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={() => router.back()}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <div className="flex items-center space-x-2">
                  <Shield className="h-6 w-6 text-destructive" />
                  <h1 className="text-xl font-bold">Organization Management</h1>
                </div>
              </div>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Organization
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto py-6 px-4 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>System Organizations</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search organizations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Button variant="outline" size="sm" onClick={fetchData}>
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
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrganizations.map((organization) => (
                      <TableRow key={organization.id}>
                        <TableCell className="font-medium">
                          {organization.name}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {organization.description || 'No description'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{organization.userCount || 0}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={organization.active ? 'default' : 'secondary'}>
                            {organization.active ? 'Active' : 'Inactive'}
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
                              <DropdownMenuItem onClick={() => openEditDialog(organization)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openDeleteDialog(organization)}
                                className="text-destructive"
                                disabled={(organization.userCount ?? 0) > 0}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {!loading && filteredOrganizations.length === 0 && (
                <div className="text-center py-8">
                  <Building className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold">No organizations found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? 'No organizations match your search.' : 'Get started by adding your first organization.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>

        {/* Add Organization Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Organization</DialogTitle>
              <DialogDescription>
                Create a new organization in the system.
              </DialogDescription>
            </DialogHeader>

            {error && (
              <Alert>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Organization Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter organization name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter organization description (optional)"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={handleAddOrganization} disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Organization'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Organization Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Organization</DialogTitle>
              <DialogDescription>
                Update organization information and settings.
              </DialogDescription>
            </DialogHeader>

            {error && (
              <Alert>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editName">Organization Name</Label>
                <Input
                  id="editName"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editDescription">Description</Label>
                <Textarea
                  id="editDescription"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="editActive"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({...formData, active: checked})}
                />
                <Label htmlFor="editActive">Active</Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={handleEditOrganization} disabled={submitting}>
                {submitting ? 'Updating...' : 'Update Organization'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Organization</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedOrganization?.name}"?
                This action cannot be undone.
                {selectedOrganization?.userCount > 0 && (
                  <span className="block mt-2 text-destructive">
                    Warning: This organization has {selectedOrganization.userCount} users.
                    Please reassign or remove users before deleting.
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>

            {error && (
              <Alert>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteOrganization}
                disabled={submitting || (selectedOrganization?.userCount > 0)}
              >
                {submitting ? 'Deleting...' : 'Delete Organization'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </RoleProtectedRoute>
  );
};

export default OrganizationManagementPage;
