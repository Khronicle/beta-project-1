import { MAX_LOGIN_ATTEMPTS } from '../types/auth';
import type { AdminUpdateUserInput, Role, StoredUser } from '../types/auth';
import { hashPassword } from './passwordHash';

const USERS_KEY = 'weather-dashboard:users';

export const DEFAULT_ADMIN_CREDENTIALS = {
  email: 'admin@weatherdash.com',
  password: 'Admin123!',
};

function readUsers(): StoredUser[] {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function ensureSeedAdmin(): Promise<void> {
  const users = readUsers();
  if (users.length > 0) return;

  const { hash, salt } = await hashPassword(DEFAULT_ADMIN_CREDENTIALS.password);
  const admin: StoredUser = {
    id: crypto.randomUUID(),
    firstName: 'Admin',
    lastName: 'User',
    country: 'United States',
    phone: '+1 (000) 000-0000',
    email: DEFAULT_ADMIN_CREDENTIALS.email,
    role: 'admin',
    createdAt: new Date().toISOString(),
    passwordHash: hash,
    passwordSalt: salt,
    failedLoginAttempts: 0,
    isLocked: false,
  };
  writeUsers([admin]);
}

export function getAllUsers(): StoredUser[] {
  return readUsers();
}

export function findUserByEmail(email: string): StoredUser | undefined {
  const normalized = email.trim().toLowerCase();
  return readUsers().find((user) => user.email.toLowerCase() === normalized);
}

export function findUserById(id: string): StoredUser | undefined {
  return readUsers().find((user) => user.id === id);
}

export function addUser(user: StoredUser): void {
  const users = readUsers();
  users.push(user);
  writeUsers(users);
}

function updateUser(id: string, patch: Partial<StoredUser>): StoredUser | undefined {
  const users = readUsers();
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) return undefined;

  users[index] = { ...users[index], ...patch };
  writeUsers(users);
  return users[index];
}

export function updateUserRoleById(id: string, role: Role): StoredUser | undefined {
  return updateUser(id, { role });
}

export function updateUserDetailsById(
  id: string,
  details: AdminUpdateUserInput
): StoredUser | undefined {
  return updateUser(id, {
    firstName: details.firstName.trim(),
    lastName: details.lastName.trim(),
    country: details.country,
    phone: details.phone.trim(),
    email: details.email.trim(),
  });
}

export function deleteUserById(id: string): boolean {
  const users = readUsers();
  const next = users.filter((user) => user.id !== id);
  if (next.length === users.length) return false;
  writeUsers(next);
  return true;
}

export function recordFailedLogin(id: string): StoredUser | undefined {
  const user = findUserById(id);
  if (!user) return undefined;

  const attempts = user.failedLoginAttempts + 1;
  return updateUser(id, {
    failedLoginAttempts: attempts,
    isLocked: attempts >= MAX_LOGIN_ATTEMPTS,
  });
}

export function resetFailedLoginById(id: string): StoredUser | undefined {
  return updateUser(id, { failedLoginAttempts: 0 });
}

export function unlockUserById(id: string): StoredUser | undefined {
  return updateUser(id, { isLocked: false, failedLoginAttempts: 0 });
}

export function setPasswordById(
  id: string,
  passwordHash: string,
  passwordSalt: string
): StoredUser | undefined {
  return updateUser(id, {
    passwordHash,
    passwordSalt,
    isLocked: false,
    failedLoginAttempts: 0,
  });
}
