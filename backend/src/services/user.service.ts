import { AppError } from "../errors/app-error";
import * as userRepository from "../repositories/user.repository";
import * as notificationService from "./notification.service";
import type { UpdateProfileInput, UpdateSettingsInput } from "../schemas/user.schema";

export async function getUserProfile(userId: string) {
  const user = await userRepository.getUserProfile(userId);
  if (!user) {
    throw new AppError({
      message: "User not found",
      statusCode: 404,
      code: "USER_NOT_FOUND"
    });
  }
  return user;
}

export async function getPublicProfile(username: string) {
  const user = await userRepository.getPublicProfile(username);
  if (!user) {
    throw new AppError({
      message: "User not found",
      statusCode: 404,
      code: "USER_NOT_FOUND"
    });
  }
  return user;
}

export async function updateProfile(userId: string, input: UpdateProfileInput) {
  const updateData: {
    displayName?: string;
    bio?: string | null;
    avatarUrl?: string | null;
    bannerUrl?: string | null;
  } = {};

  if (input.displayName !== undefined) updateData.displayName = input.displayName;
  if (input.bio !== undefined) updateData.bio = input.bio;
  if (input.avatarUrl !== undefined) updateData.avatarUrl = input.avatarUrl;
  if (input.bannerUrl !== undefined) updateData.bannerUrl = input.bannerUrl;

  const user = await userRepository.updateUserProfile(userId, updateData);

  return user;
}

export async function getUserSettings(userId: string) {
  const settings = await userRepository.getUserSettings(userId);
  if (!settings) {
    throw new AppError({
      message: "User settings not found",
      statusCode: 404,
      code: "SETTINGS_NOT_FOUND"
    });
  }
  return settings;
}

export async function updateSettings(userId: string, input: UpdateSettingsInput) {
  const updateData: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    directMessageNotifications?: boolean;
    privacyProfilePublic?: boolean;
  } = {};

  if (input.emailNotifications !== undefined) updateData.emailNotifications = input.emailNotifications;
  if (input.pushNotifications !== undefined) updateData.pushNotifications = input.pushNotifications;
  if (input.directMessageNotifications !== undefined) updateData.directMessageNotifications = input.directMessageNotifications;
  if (input.privacyProfilePublic !== undefined) updateData.privacyProfilePublic = input.privacyProfilePublic;

  return userRepository.updateUserSettings(userId, updateData);
}

export async function followUser(followerId: string, followingId: string) {
  if (followerId === followingId) {
    throw new AppError({
      message: "You cannot follow yourself",
      statusCode: 400,
      code: "CANNOT_FOLLOW_SELF"
    });
  }

  const existingFollow = await userRepository.checkFollowStatus(followerId, followingId);
  if (existingFollow) {
    throw new AppError({
      message: "You already follow this user",
      statusCode: 400,
      code: "ALREADY_FOLLOWING"
    });
  }

  const follow = await userRepository.followUser(followerId, followingId);

  // Create notification for the followed user
  await notificationService.createNotification({
    recipientId: followingId,
    actorId: followerId,
    type: "FOLLOW"
  });

  return follow;
}

export async function unfollowUser(followerId: string, followingId: string) {
  return userRepository.unfollowUser(followerId, followingId);
}

export async function getFollowStatus(followerId: string, followingId: string) {
  const follow = await userRepository.checkFollowStatus(followerId, followingId);
  return {
    isFollowing: !!follow
  };
}

export async function getFollowers(userId: string, limit: number = 20, skip: number = 0) {
  const follows = await userRepository.getFollowers(userId, limit, skip);
  const total = await userRepository.getFollowerCount(userId);

  return {
    followers: follows.map((f: { follower: typeof follows[0]["follower"] }) => f.follower),
    total,
    hasMore: skip + limit < total
  };
}

export async function getFollowing(userId: string, limit: number = 20, skip: number = 0) {
  const follows = await userRepository.getFollowing(userId, limit, skip);
  const total = await userRepository.getFollowingCount(userId);

  return {
    following: follows.map((f: { following: typeof follows[0]["following"] }) => f.following),
    total,
    hasMore: skip + limit < total
  };
}
