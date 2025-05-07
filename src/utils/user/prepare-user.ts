import type { User } from '@prisma/client';

export interface PrismaUser {
  id: string;
  email: string | null;
  password: string | null;
  name: string | null;
  photoUrl: string | null;
  emailVerified: Date | null;
  twoFactorEnabled: boolean;
  twoFactorSecret: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type SafeUser = Omit<
  PrismaUser,
  'password' | 'createdAt' | 'updatedAt' | 'twoFactorSecret'
>;

export const prepareUserForClient = (user: PrismaUser): SafeUser => {
  const { password, createdAt, updatedAt, twoFactorSecret, ...safeUser } = user;
  return safeUser;
};
