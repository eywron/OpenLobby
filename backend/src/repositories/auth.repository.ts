import { prisma } from '../lib/prisma.js';

export const findUserByFirebaseUid = async (firebaseUid: string) => {
  return prisma.user.findUnique({
    where: { firebaseUid },
  });
};

export const findUserById = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      settings: true,
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true,
        },
      },
    },
  });
};

export const upsertUserByFirebaseUid = async (data: {
  firebaseUid: string;
  email: string;
  displayName: string;
  username: string;
  provider: string;
  emailVerified: boolean;
  avatarUrl?: string;
}) => {
  return prisma.user.upsert({
    where: { firebaseUid: data.firebaseUid },
    update: {
      email: data.email,
      displayName: data.displayName,
      provider: data.provider,
      emailVerified: data.emailVerified,
      avatarUrl: data.avatarUrl || undefined,
      accountStatus: 'ACTIVE',
    },
    create: {
      firebaseUid: data.firebaseUid,
      email: data.email,
      displayName: data.displayName,
      username: data.username,
      provider: data.provider,
      emailVerified: data.emailVerified,
      avatarUrl: data.avatarUrl,
      settings: {
        create: {},
      },
    },
    include: {
      settings: true,
    },
  });
};

export const deleteUser = async (userId: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      accountStatus: 'DELETED',
      deletedAt: new Date(),
    },
  });
};

export const updateUserProfile = async (
  userId: string,
  data: {
    username?: string;
    displayName?: string;
    bio?: string;
    location?: string;
    website?: string;
    avatarUrl?: string;
    bannerUrl?: string;
  },
) => {
  return prisma.user.update({
    where: { id: userId },
    data,
  });
};
