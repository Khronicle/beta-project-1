export type Role = 'admin' | 'user';

export const MAX_LOGIN_ATTEMPTS = 3;

export interface StoredUser {
  id: string;
  firstName: string;
  lastName: string;
  country: string;
  phone: string;
  email: string;
  role: Role;
  createdAt: string;
  passwordHash: string;
  passwordSalt: string;
  failedLoginAttempts: number;
  isLocked: boolean;
}

export type PublicUser = Omit<StoredUser, 'passwordHash' | 'passwordSalt'>;

export interface SignupInput {
  firstName: string;
  lastName: string;
  country: string;
  phone: string;
  email: string;
  password: string;
}

export interface AdminCreateUserInput {
  firstName: string;
  lastName: string;
  country: string;
  phone: string;
  email: string;
  role: Role;
}

export interface AdminUpdateUserInput {
  firstName: string;
  lastName: string;
  country: string;
  phone: string;
  email: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  tempPassword?: string;
}
