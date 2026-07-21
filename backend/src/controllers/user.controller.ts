import type { Request, Response } from "express";

import { AppError } from "../errors/app-error";
import { createSuccessResponse, createErrorResponse } from "../utils/api-response";
import { updateProfileSchema, updateSettingsSchema } from "../schemas/user.schema";
import * as userService from "../services/user.service";

export async function getProfile(request: Request, response: Response): Promise<void> {
  const userId = request.user?.userId;
  if (!userId) {
    throw new AppError({
      message: "User not authenticated",
      statusCode: 401,
      code: "UNAUTHORIZED"
    });
  }

  const profile = await userService.getUserProfile(userId);
  response.status(200).json(createSuccessResponse(profile, "Profile retrieved"));
}

export async function getPublicProfile(request: Request, response: Response): Promise<void> {
  const username = Array.isArray(request.params.username)
    ? request.params.username[0]
    : request.params.username;
  if (!username) {
    throw new AppError({
      message: "Username is required",
      statusCode: 400,
      code: "MISSING_USERNAME"
    });
  }

  const profile = await userService.getPublicProfile(username);
  response.status(200).json(createSuccessResponse(profile, "Public profile retrieved"));
}

export async function updateProfile(request: Request, response: Response): Promise<void> {
  const userId = request.user?.userId;
  if (!userId) {
    throw new AppError({
      message: "User not authenticated",
      statusCode: 401,
      code: "UNAUTHORIZED"
    });
  }

  const validation = updateProfileSchema.safeParse(request.body);
  if (!validation.success) {
    response.status(400).json(
      createErrorResponse({
        code: "VALIDATION_ERROR",
        message: "Invalid input",
        details: validation.error.flatten()
      })
    );
    return;
  }

  const profile = await userService.updateProfile(userId, validation.data);
  response.status(200).json(createSuccessResponse(profile, "Profile updated"));
}

export async function getSettings(request: Request, response: Response): Promise<void> {
  const userId = request.user?.userId;
  if (!userId) {
    throw new AppError({
      message: "User not authenticated",
      statusCode: 401,
      code: "UNAUTHORIZED"
    });
  }

  const settings = await userService.getUserSettings(userId);
  response.status(200).json(createSuccessResponse(settings, "Settings retrieved"));
}

export async function updateSettings(request: Request, response: Response): Promise<void> {
  const userId = request.user?.userId;
  if (!userId) {
    throw new AppError({
      message: "User not authenticated",
      statusCode: 401,
      code: "UNAUTHORIZED"
    });
  }

  const validation = updateSettingsSchema.safeParse(request.body);
  if (!validation.success) {
    response.status(400).json(
      createErrorResponse({
        code: "VALIDATION_ERROR",
        message: "Invalid input",
        details: validation.error.flatten()
      })
    );
    return;
  }

  const settings = await userService.updateSettings(userId, validation.data);
  response.status(200).json(createSuccessResponse(settings, "Settings updated"));
}

export async function followUser(request: Request, response: Response): Promise<void> {
  const followerId = request.user?.userId;
  if (!followerId) {
    throw new AppError({
      message: "User not authenticated",
      statusCode: 401,
      code: "UNAUTHORIZED"
    });
  }

  const { userId: followingId } = request.body;
  if (!followingId) {
    throw new AppError({
      message: "User ID to follow is required",
      statusCode: 400,
      code: "MISSING_USER_ID"
    });
  }

  await userService.followUser(followerId, followingId);
  response.status(201).json(createSuccessResponse({ success: true }, "User followed"));
}

export async function unfollowUser(request: Request, response: Response): Promise<void> {
  const followerId = request.user?.userId;
  if (!followerId) {
    throw new AppError({
      message: "User not authenticated",
      statusCode: 401,
      code: "UNAUTHORIZED"
    });
  }

  const followingId = Array.isArray(request.params.userId)
    ? request.params.userId[0]
    : request.params.userId;
  if (!followingId) {
    throw new AppError({
      message: "User ID to unfollow is required",
      statusCode: 400,
      code: "MISSING_USER_ID"
    });
  }

  await userService.unfollowUser(followerId, followingId);
  response.status(200).json(createSuccessResponse({ success: true }, "User unfollowed"));
}

export async function getFollowStatus(request: Request, response: Response): Promise<void> {
  const followerId = request.user?.userId;
  if (!followerId) {
    throw new AppError({
      message: "User not authenticated",
      statusCode: 401,
      code: "UNAUTHORIZED"
    });
  }

  const followingId = Array.isArray(request.params.userId)
    ? request.params.userId[0]
    : request.params.userId;
  if (!followingId) {
    throw new AppError({
      message: "User ID is required",
      statusCode: 400,
      code: "MISSING_USER_ID"
    });
  }

  const status = await userService.getFollowStatus(followerId, followingId);
  response.status(200).json(createSuccessResponse(status, "Follow status retrieved"));
}

export async function getFollowers(request: Request, response: Response): Promise<void> {
  const userId = Array.isArray(request.params.userId)
    ? request.params.userId[0]
    : request.params.userId;
  if (!userId) {
    throw new AppError({
      message: "User ID is required",
      statusCode: 400,
      code: "MISSING_USER_ID"
    });
  }

  const limit = Math.min(parseInt(request.query.limit as string) || 20, 100);
  const skip = Math.max(parseInt(request.query.skip as string) || 0, 0);

  const result = await userService.getFollowers(userId, limit, skip);
  response.status(200).json(createSuccessResponse(result, "Followers retrieved"));
}

export async function getFollowing(request: Request, response: Response): Promise<void> {
  const userId = Array.isArray(request.params.userId)
    ? request.params.userId[0]
    : request.params.userId;
  if (!userId) {
    throw new AppError({
      message: "User ID is required",
      statusCode: 400,
      code: "MISSING_USER_ID"
    });
  }

  const limit = Math.min(parseInt(request.query.limit as string) || 20, 100);
  const skip = Math.max(parseInt(request.query.skip as string) || 0, 0);

  const result = await userService.getFollowing(userId, limit, skip);
  response.status(200).json(createSuccessResponse(result, "Following retrieved"));
}
