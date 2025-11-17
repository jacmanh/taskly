import type { AuthUser } from './user';

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration credentials
 */
export interface RegisterCredentials {
  email: string;
  password: string;
  name?: string;
}

/**
 * Authentication response from API
 */
export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

/**
 * Token refresh response
 */
export interface RefreshTokenResponse {
  accessToken: string;
}

/**
 * Auth response returned by the API before the refresh token cookie is set
 */
export interface AuthResponseWithRefreshToken extends AuthResponse {
  refreshToken: string;
}

/**
 * Authenticated user (from JWT payload)
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  emailVerified: boolean;
  isActive: boolean;
}

/**
 * API Error response
 */
export interface ApiError {
  message: string;
  statusCode: number;
  code: string;
  error?: string;
}
