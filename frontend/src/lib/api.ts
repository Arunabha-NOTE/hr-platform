import axios from 'axios';
import { authService } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-actual-backend-url.com';

// API client with auth headers
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth interceptor
apiClient.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User interfaces
export interface User {
  id: number;
  email: string;
  role: string;
  active: boolean;
  firstLogin: boolean;
  organization: {
    id: number;
    name: string;
  };
}

export interface CreateUserRequest {
  email: string;
  password: string;
  role: string;
  organizationId: number;
}

export interface UpdateUserRequest {
  email: string;
  role: string;
  active: boolean;
}

// Organization interfaces
export interface Organization {
  id: number;
  name: string;
  description?: string;
  userCount?: number;
}

export interface CreateOrganizationRequest {
  name: string;
  description?: string;
}

export interface UpdateOrganizationRequest {
  name: string;
  description?: string;
}

// User API methods
export const userApi = {
  getAll: async (): Promise<User[]> => {
    const response = await apiClient.get('/api/superadmin/users');
    return response.data;
  },

  getById: async (id: number): Promise<User> => {
    const response = await apiClient.get(`/api/superadmin/users/${id}`);
    return response.data;
  },

  create: async (user: CreateUserRequest): Promise<User> => {
    const response = await apiClient.post(`/api/superadmin/users/organization/${user.organizationId}`, user);
    return response.data;
  },

  update: async (id: number, user: UpdateUserRequest): Promise<User> => {
    const response = await apiClient.put(`/api/superadmin/users/${id}`, user);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/superadmin/users/${id}`);
  },

  resetPassword: async (id: number): Promise<{ temporaryPassword: string }> => {
    const response = await apiClient.post(`/api/superadmin/users/${id}/reset-password`);
    return response.data;
  }
};

// Organization API methods
export const organizationApi = {
  getAll: async (): Promise<Organization[]> => {
    const response = await apiClient.get('/api/superadmin/organizations');
    return response.data;
  },

  getById: async (id: number): Promise<Organization> => {
    const response = await apiClient.get(`/api/superadmin/organizations/${id}`);
    return response.data;
  },

  create: async (org: CreateOrganizationRequest): Promise<Organization> => {
    const response = await apiClient.post('/api/superadmin/organizations', org);
    return response.data;
  },

  update: async (id: number, org: UpdateOrganizationRequest): Promise<Organization> => {
    const response = await apiClient.put(`/api/superadmin/organizations/${id}`, org);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/superadmin/organizations/${id}`);
  }
};

// Dashboard stats API
export const statsApi = {
  getDashboardStats: async () => {
    const [users, organizations] = await Promise.all([
      userApi.getAll(),
      organizationApi.getAll()
    ]);

    return {
      totalUsers: users.length,
      totalOrganizations: organizations.length,
      activeUsers: users.filter(u => u.active).length,
    };
  }
};
