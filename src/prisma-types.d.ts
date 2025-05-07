import { PrismaClient } from '@prisma/client';

declare module '@prisma/client' {
  export enum SenderType {
    CONTACT = 'CONTACT',
    ADMIN = 'ADMIN',
  }

  export interface User {
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
    isEmailVerified: boolean;
    isActive: boolean;
    isTwoFactorEnabled: boolean;
    verificationToken?: string | null;
    resetPasswordToken?: string | null;
    resetPasswordExpires?: Date | null;
    firstName?: string | null;
    lastName?: string | null;
  }

  export interface Message {
    id: string;
    chatId: string;
    senderType: SenderType | string;
    text: string;
    date: Date;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
    adminId: string | null;
  }

  export namespace Prisma {
    export enum TransactionIsolationLevel {
      ReadUncommitted = 'ReadUncommitted',
      ReadCommitted = 'ReadCommitted',
      RepeatableRead = 'RepeatableRead',
      Serializable = 'Serializable',
    }
  }
}
