/**
 * User entity - shared between frontend and backend
 */
export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  emailVerified: boolean;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Public user profile (without sensitive data)
 */
export type UserProfile = Omit<User, 'isActive'>;

/**
 * User for auth responses (minimal data)
 */
export type AuthUser = Pick<
  User,
  'id' | 'email' | 'name' | 'avatar' | 'emailVerified'
>;
