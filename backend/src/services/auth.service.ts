import { randomBytes } from 'crypto';
import * as authRepo from '../repositories/auth.repository.js';
import { firebaseAuth } from '../config/firebase.js';
import { AppError } from '../errors/app-error.js';
import { prisma } from '../lib/prisma.js';

export const syncUser = async (
  firebaseUser: {
    uid: string;
    email?: string;
    displayName?: string;
    photoURL?: string;
    provider?: string;
    emailVerified?: boolean;
  },
  usernameOverride?: string,
) => {
  const email = firebaseUser.email;
  if (!email) {
    throw new AppError({ statusCode: 400, message: 'Email is required from Firebase provider' });
  }

  const existingUser = await authRepo.findUserByFirebaseUid(firebaseUser.uid);
  let username = existingUser?.username;

  if (!username) {
    if (usernameOverride) {
      const exists = await prisma.user.findUnique({ where: { username: usernameOverride } });
      if (exists) throw new AppError({ statusCode: 409, message: 'Username already taken' });
      username = usernameOverride;
    } else {
      const emailPrefix = (email.split('@')[0] || '').replace(/[^a-zA-Z0-9_]/g, '');
      const suffix = randomBytes(2).toString('hex');
      username = `${emailPrefix}_${suffix}`;
    }
  }

  return authRepo.upsertUserByFirebaseUid({
    firebaseUid: firebaseUser.uid,
    email,
    displayName: firebaseUser.displayName || username,
    username,
    provider: firebaseUser.provider || 'email',
    emailVerified: firebaseUser.emailVerified || false,
    ...(firebaseUser.photoURL ? { avatarUrl: firebaseUser.photoURL } : {}),
  });
};

export const deleteAccount = async (userId: string, firebaseUid: string) => {
  await authRepo.deleteUser(userId);
  try {
    await firebaseAuth.deleteUser(firebaseUid);
  } catch (error) {
    // Log error but continue as we already deleted in PostgreSQL
    console.error('Failed to delete user from Firebase Auth', error);
  }
};

export const getUserProfile = async (userId: string) => {
  const user = await authRepo.findUserById(userId);
  if (!user) throw new AppError({ statusCode: 404, message: 'User not found' });
  return user;
};
