import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type {
  AdminCreateUserInput,
  AdminUpdateUserInput,
  AuthResult,
  PublicUser,
  Role,
  SignupInput,
  StoredUser,
} from '../types/auth';
import { MAX_LOGIN_ATTEMPTS } from '../types/auth';
import { hashPassword, verifyPassword } from '../services/passwordHash';
import { generateTempPassword } from '../services/tempPassword';
import {
  addUser,
  deleteUserById,
  ensureSeedAdmin,
  findUserByEmail,
  findUserById,
  getAllUsers,
  recordFailedLogin,
  resetFailedLoginById,
  setPasswordById,
  unlockUserById,
  updateUserDetailsById,
  updateUserRoleById,
} from '../services/userStorage';

const CURRENT_USER_KEY = 'weather-dashboard:currentUserId';

function toPublicUser(user: StoredUser): PublicUser {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    country: user.country,
    phone: user.phone,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    failedLoginAttempts: user.failedLoginAttempts,
    isLocked: user.isLocked,
  };
}

interface AuthContextValue {
  currentUser: PublicUser | null;
  users: PublicUser[];
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (input: SignupInput) => Promise<AuthResult>;
  logout: () => void;
  updateUserRole: (userId: string, role: Role) => AuthResult;
  updateProfile: (input: AdminUpdateUserInput) => AuthResult;
  changePassword: (currentPassword: string, newPassword: string) => Promise<AuthResult>;
  adminCreateUser: (input: AdminCreateUserInput) => Promise<AuthResult>;
  adminUpdateUser: (userId: string, input: AdminUpdateUserInput) => AuthResult;
  adminDeleteUser: (userId: string) => AuthResult;
  adminUnlockUser: (userId: string) => AuthResult;
  adminResetPassword: (userId: string) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<PublicUser | null>(null);
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUsers = useCallback(() => {
    setUsers(getAllUsers().map(toPublicUser));
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      await ensureSeedAdmin();
      if (cancelled) return;

      refreshUsers();

      const storedId = localStorage.getItem(CURRENT_USER_KEY);
      if (storedId) {
        const match = getAllUsers().find((user) => user.id === storedId);
        setCurrentUser(match ? toPublicUser(match) : null);
      }

      setIsLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [refreshUsers]);

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    const user = findUserByEmail(email);
    if (!user) {
      return { success: false, error: 'Incorrect email or password.' };
    }

    if (user.isLocked) {
      return {
        success: false,
        error: 'This account is locked after too many failed login attempts. Contact an admin to unlock it.',
      };
    }

    const passwordMatches = await verifyPassword(password, user.passwordSalt, user.passwordHash);
    if (!passwordMatches) {
      const updated = recordFailedLogin(user.id);
      refreshUsers();
      if (updated?.isLocked) {
        return {
          success: false,
          error: 'Incorrect password. Your account is now locked after 3 failed attempts. Contact an admin to unlock it.',
        };
      }
      const remaining = MAX_LOGIN_ATTEMPTS - (updated?.failedLoginAttempts ?? 0);
      return {
        success: false,
        error: `Incorrect email or password. ${remaining} attempt(s) remaining before your account is locked.`,
      };
    }

    if (user.failedLoginAttempts > 0) {
      resetFailedLoginById(user.id);
    }
    refreshUsers();
    setCurrentUser(toPublicUser({ ...user, failedLoginAttempts: 0 }));
    localStorage.setItem(CURRENT_USER_KEY, user.id);
    return { success: true };
  }, [refreshUsers]);

  const signup = useCallback(async (input: SignupInput): Promise<AuthResult> => {
    const trimmedEmail = input.email.trim();
    if (findUserByEmail(trimmedEmail)) {
      return { success: false, error: 'An account with that email already exists.' };
    }

    const { hash, salt } = await hashPassword(input.password);
    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      country: input.country,
      phone: input.phone.trim(),
      email: trimmedEmail,
      // Every new account is auto-assigned the base 'user' role by the system.
      // Nothing in this form (or SignupInput) can set 'admin' — role promotion
      // only happens later, via updateUserRole, and only an admin can call it.
      role: 'user',
      createdAt: new Date().toISOString(),
      passwordHash: hash,
      passwordSalt: salt,
      failedLoginAttempts: 0,
      isLocked: false,
    };

    addUser(newUser);
    refreshUsers();
    setCurrentUser(toPublicUser(newUser));
    localStorage.setItem(CURRENT_USER_KEY, newUser.id);
    return { success: true };
  }, [refreshUsers]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  }, []);

  const updateUserRole = useCallback(
    (userId: string, role: Role): AuthResult => {
      if (currentUser?.role !== 'admin') {
        return { success: false, error: 'Only an admin can change user roles.' };
      }

      const updated = updateUserRoleById(userId, role);
      if (!updated) {
        return { success: false, error: 'User not found.' };
      }

      refreshUsers();
      if (currentUser.id === updated.id) {
        setCurrentUser(toPublicUser(updated));
      }
      return { success: true };
    },
    [currentUser, refreshUsers]
  );

  const updateProfile = useCallback(
    (input: AdminUpdateUserInput): AuthResult => {
      if (!currentUser) {
        return { success: false, error: 'You must be logged in.' };
      }

      const trimmedEmail = input.email.trim();
      const existing = findUserByEmail(trimmedEmail);
      if (existing && existing.id !== currentUser.id) {
        return { success: false, error: 'Another account already uses that email.' };
      }

      const updated = updateUserDetailsById(currentUser.id, input);
      if (!updated) {
        return { success: false, error: 'User not found.' };
      }

      refreshUsers();
      setCurrentUser(toPublicUser(updated));
      return { success: true };
    },
    [currentUser, refreshUsers]
  );

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string): Promise<AuthResult> => {
      if (!currentUser) {
        return { success: false, error: 'You must be logged in.' };
      }

      const stored = findUserById(currentUser.id);
      if (!stored) {
        return { success: false, error: 'User not found.' };
      }

      const matches = await verifyPassword(currentPassword, stored.passwordSalt, stored.passwordHash);
      if (!matches) {
        return { success: false, error: 'Current password is incorrect.' };
      }

      const { hash, salt } = await hashPassword(newPassword);
      setPasswordById(currentUser.id, hash, salt);
      refreshUsers();
      return { success: true };
    },
    [currentUser, refreshUsers]
  );

  const adminCreateUser = useCallback(
    async (input: AdminCreateUserInput): Promise<AuthResult> => {
      if (currentUser?.role !== 'admin') {
        return { success: false, error: 'Only an admin can add users.' };
      }

      const trimmedEmail = input.email.trim();
      if (findUserByEmail(trimmedEmail)) {
        return { success: false, error: 'An account with that email already exists.' };
      }

      const tempPassword = generateTempPassword();
      const { hash, salt } = await hashPassword(tempPassword);
      const newUser: StoredUser = {
        id: crypto.randomUUID(),
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        country: input.country,
        phone: input.phone.trim(),
        email: trimmedEmail,
        role: input.role,
        createdAt: new Date().toISOString(),
        passwordHash: hash,
        passwordSalt: salt,
        failedLoginAttempts: 0,
        isLocked: false,
      };
      addUser(newUser);
      refreshUsers();

      return { success: true, tempPassword };
    },
    [currentUser, refreshUsers]
  );

  const adminUpdateUser = useCallback(
    (userId: string, input: AdminUpdateUserInput): AuthResult => {
      if (currentUser?.role !== 'admin') {
        return { success: false, error: 'Only an admin can update users.' };
      }

      const trimmedEmail = input.email.trim();
      const existing = findUserByEmail(trimmedEmail);
      if (existing && existing.id !== userId) {
        return { success: false, error: 'Another account already uses that email.' };
      }

      const updated = updateUserDetailsById(userId, input);
      if (!updated) {
        return { success: false, error: 'User not found.' };
      }

      refreshUsers();
      if (currentUser.id === updated.id) {
        setCurrentUser(toPublicUser(updated));
      }
      return { success: true };
    },
    [currentUser, refreshUsers]
  );

  const adminDeleteUser = useCallback(
    (userId: string): AuthResult => {
      if (currentUser?.role !== 'admin') {
        return { success: false, error: 'Only an admin can delete users.' };
      }
      if (currentUser.id === userId) {
        return { success: false, error: 'You cannot delete your own account.' };
      }

      const deleted = deleteUserById(userId);
      if (!deleted) {
        return { success: false, error: 'User not found.' };
      }

      refreshUsers();
      return { success: true };
    },
    [currentUser, refreshUsers]
  );

  const adminUnlockUser = useCallback(
    (userId: string): AuthResult => {
      if (currentUser?.role !== 'admin') {
        return { success: false, error: 'Only an admin can unlock accounts.' };
      }

      const updated = unlockUserById(userId);
      if (!updated) {
        return { success: false, error: 'User not found.' };
      }

      refreshUsers();
      return { success: true };
    },
    [currentUser, refreshUsers]
  );

  const adminResetPassword = useCallback(
    async (userId: string): Promise<AuthResult> => {
      if (currentUser?.role !== 'admin') {
        return { success: false, error: 'Only an admin can reset passwords.' };
      }
      if (!findUserById(userId)) {
        return { success: false, error: 'User not found.' };
      }

      const tempPassword = generateTempPassword();
      const { hash, salt } = await hashPassword(tempPassword);
      setPasswordById(userId, hash, salt);
      refreshUsers();

      return { success: true, tempPassword };
    },
    [currentUser, refreshUsers]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      currentUser,
      users,
      isLoading,
      isAdmin: currentUser?.role === 'admin',
      login,
      signup,
      logout,
      updateUserRole,
      updateProfile,
      changePassword,
      adminCreateUser,
      adminUpdateUser,
      adminDeleteUser,
      adminUnlockUser,
      adminResetPassword,
    }),
    [
      currentUser,
      users,
      isLoading,
      login,
      signup,
      logout,
      updateUserRole,
      updateProfile,
      changePassword,
      adminCreateUser,
      adminUpdateUser,
      adminDeleteUser,
      adminUnlockUser,
      adminResetPassword,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
