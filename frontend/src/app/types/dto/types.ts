import { Role } from '../enums/enums';

export interface authRequest {
    email: string;
    password: string;
}

export interface authResponse {
    token: string;
    refreshToken: string;
    firstLogin: boolean;
}

export interface changePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export interface createOrganizationRequest {
    name: string;
    description?: string;
}

export interface createSuperAdminRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface createUserRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: Role;
}