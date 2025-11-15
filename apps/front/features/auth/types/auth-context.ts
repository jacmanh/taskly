import type { User, LoginCredentials, RegisterCredentials } from '@taskly/types';

/**
 * Auth Context Type - Frontend only
 * Used by React Context API
 */
export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}
