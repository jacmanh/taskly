import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  User,
} from '@taskly/types';
import { axiosInstance, setAccessToken, clearAccessToken } from './axios';

export const authService = {
  /**
   * Register a new user
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const { data } = await axiosInstance.post<AuthResponse>('/auth/register', credentials);
    setAccessToken(data.accessToken);
    return data;
  },

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
    setAccessToken(data.accessToken);
    return data;
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await axiosInstance.post('/auth/logout');
    } finally {
      clearAccessToken();
    }
  },

  /**
   * Get current user profile
   */
  async getMe(): Promise<User> {
    const { data } = await axiosInstance.get<User>('/users/me');
    return data;
  },

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<string> {
    const { data } = await axiosInstance.post<{ accessToken: string }>('/auth/refresh');
    setAccessToken(data.accessToken);
    return data.accessToken;
  },
};
