import { prisma } from '../lib/prisma';

export async function getUserProfile(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      displayName: true,
      email: true,
      bio: true,
      avatarUrl: true,
      bannerUrl: true,
      role: true,
      accountStatus: true,
      createdAt: true,
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true,
        },
      },
    },
  });
}

export async function getPublicProfile(username: string) {
  return prisma.user.findUnique({
    where: { username: username.toLowerCase() },
    select: {
      id: true,
      username: true,
      displayName: true,
      bio: true,
      avatarUrl: true,
      bannerUrl: true,
      createdAt: true,
      _count: {
        select: {
          posts: {
            where: { deletedAt: null, visibility: 'PUBLIC' },
          },
          followers: true,
          following: true,
        },
      },
    },
  });
}

export async function updateUserProfile(
  userId: string,
  data: {
    displayName?: string;
    bio?: string | null;
    avatarUrl?: string | null;
    bannerUrl?: string | null;
  },
) {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      username: true,
      displayName: true,
      bio: true,
      avatarUrl: true,
      bannerUrl: true,
      email: true,
      role: true,
      accountStatus: true,
      createdAt: true,
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true,
        },
      },
    },
  });
}

export async function getUserSettings(userId: string) {
  return prisma.userSettings.findUnique({
    where: { userId },
  });
}

export async function updateUserSettings(
  userId: string,
  data: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    directMessageNotifications?: boolean;
    privacyProfilePublic?: boolean;
  },
) {
  return prisma.userSettings.update({
    where: { userId },
    data,
  });
}

export async function followUser(followerId: string, followingId: string) {
  return prisma.follow.create({
    data: {
      followerId,
      followingId,
    },
  });
}

export async function unfollowUser(followerId: string, followingId: string) {
  return prisma.follow.deleteMany({
    where: {
      followerId,
      followingId,
    },
  });
}

export async function checkFollowStatus(followerId: string, followingId: string) {
  return prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });
}

export async function getFollowers(userId: string, limit: number = 20, skip: number = 0) {
  return prisma.follow.findMany({
    where: { followingId: userId },
    include: {
      follower: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          bio: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip,
  });
}

export async function getFollowing(userId: string, limit: number = 20, skip: number = 0) {
  return prisma.follow.findMany({
    where: { followerId: userId },
    include: {
      following: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          bio: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip,
  });
}

export async function getFollowerCount(userId: string) {
  return prisma.follow.count({
    where: { followingId: userId },
  });
}

export async function getFollowingCount(userId: string) {
  return prisma.follow.count({
    where: { followerId: userId },
  });
}
