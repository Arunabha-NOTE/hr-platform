import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { authRequest, authResponse } from '../app/types/dto/types';
import { Role } from '../app/types/enums/enums';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface TokenResponse {
  token: string;
  refreshToken: string;
}

export interface DecodedToken {
  sub: string;
  role: Role;
  exp: number;
  iat: number;
}

class AuthService {
  private tokenKey = 'auth_token';
  private refreshTokenKey = 'refresh_token';

  async login(credentials: authRequest): Promise<authResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
      const authData = response.data;

      this.setTokens(authData.token, authData.refreshToken);
      return authData;
    } catch (error) {
      throw new Error('Login failed');
    }
  }

  async refreshToken(): Promise<TokenResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refreshToken
      });
      const tokenData = response.data;

      this.setTokens(tokenData.token, tokenData.refreshToken);
      return tokenData;
    } catch (error) {
      this.clearTokens();
      throw new Error('Token refresh failed');
    }
  }

  logout(): void {
    this.clearTokens();
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.tokenKey);
  }

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.refreshTokenKey);
  }

  setTokens(token: string, refreshToken: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  getUserInfo(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<DecodedToken>(token);
    } catch {
      return null;
    }
  }

  getAuthHeaders(): { Authorization: string } | {} {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

export const authService = new AuthService();

// Axios interceptors
axios.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await authService.refreshToken();
        const token = authService.getToken();
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axios(originalRequest);
      } catch {
        authService.logout();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
