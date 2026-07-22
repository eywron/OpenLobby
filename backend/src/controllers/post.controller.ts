import type { Request, Response } from 'express';

import { AppError } from '../errors/app-error';
import { createSuccessResponse, createErrorResponse } from '../utils/api-response';
import { createPostSchema, updatePostSchema, createCommentSchema } from '../schemas/post.schema';
import * as postService from '../services/post.service';

export async function createPost(request: Request, response: Response): Promise<void> {
  const userId = request.user?.userId;
  if (!userId) {
    throw new AppError({
      message: 'User not authenticated',
      statusCode: 401,
      code: 'UNAUTHORIZED',
    });
  }

  const validation = createPostSchema.safeParse(request.body);
  if (!validation.success) {
    response.status(400).json(
      createErrorResponse({
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        details: validation.error.flatten(),
      }),
    );
    return;
  }

  const post = await postService.createPost(userId, validation.data);
  response.status(201).json(createSuccessResponse(post, 'Post created'));
}

export async function getPost(request: Request, response: Response): Promise<void> {
  const postId = Array.isArray(request.params.postId)
    ? request.params.postId[0]
    : request.params.postId;
  if (!postId) {
    throw new AppError({
      message: 'Post ID is required',
      statusCode: 400,
      code: 'MISSING_POST_ID',
    });
  }

  const post = await postService.getPost(postId);
  response.status(200).json(createSuccessResponse(post, 'Post retrieved'));
}

export async function getFeed(request: Request, response: Response): Promise<void> {
  const userId = request.user?.userId ?? null;
  const limit = Math.min(parseInt(request.query.limit as string) || 20, 100);
  const skip = Math.max(parseInt(request.query.skip as string) || 0, 0);

  const posts = await postService.getFeed(userId, limit, skip);
  response.status(200).json(createSuccessResponse(posts, 'Feed retrieved'));
}

export async function getUserPosts(request: Request, response: Response): Promise<void> {
  const userId = Array.isArray(request.params.userId)
    ? request.params.userId[0]
    : request.params.userId;
  if (!userId) {
    throw new AppError({
      message: 'User ID is required',
      statusCode: 400,
      code: 'MISSING_USER_ID',
    });
  }

  const limit = Math.min(parseInt(request.query.limit as string) || 20, 100);
  const skip = Math.max(parseInt(request.query.skip as string) || 0, 0);

  const posts = await postService.getUserPosts(userId, limit, skip);
  response.status(200).json(createSuccessResponse(posts, 'User posts retrieved'));
}

export async function updatePost(request: Request, response: Response): Promise<void> {
  const userId = request.user?.userId;
  if (!userId) {
    throw new AppError({
      message: 'User not authenticated',
      statusCode: 401,
      code: 'UNAUTHORIZED',
    });
  }

  const postId = Array.isArray(request.params.postId)
    ? request.params.postId[0]
    : request.params.postId;
  if (!postId) {
    throw new AppError({
      message: 'Post ID is required',
      statusCode: 400,
      code: 'MISSING_POST_ID',
    });
  }

  const validation = updatePostSchema.safeParse(request.body);
  if (!validation.success) {
    response.status(400).json(
      createErrorResponse({
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        details: validation.error.flatten(),
      }),
    );
    return;
  }

  const post = await postService.updatePost(userId, postId, validation.data);
  response.status(200).json(createSuccessResponse(post, 'Post updated'));
}

export async function deletePost(request: Request, response: Response): Promise<void> {
  const userId = request.user?.userId;
  if (!userId) {
    throw new AppError({
      message: 'User not authenticated',
      statusCode: 401,
      code: 'UNAUTHORIZED',
    });
  }

  const postId = Array.isArray(request.params.postId)
    ? request.params.postId[0]
    : request.params.postId;
  if (!postId) {
    throw new AppError({
      message: 'Post ID is required',
      statusCode: 400,
      code: 'MISSING_POST_ID',
    });
  }

  await postService.deletePost(userId, postId);
  response.status(200).json(createSuccessResponse({ success: true }, 'Post deleted'));
}

export async function likePost(request: Request, response: Response): Promise<void> {
  const userId = request.user?.userId;
  if (!userId) {
    throw new AppError({
      message: 'User not authenticated',
      statusCode: 401,
      code: 'UNAUTHORIZED',
    });
  }

  const postId = Array.isArray(request.params.postId)
    ? request.params.postId[0]
    : request.params.postId;
  if (!postId) {
    throw new AppError({
      message: 'Post ID is required',
      statusCode: 400,
      code: 'MISSING_POST_ID',
    });
  }

  await postService.likePost(userId, postId);
  response.status(201).json(createSuccessResponse({ success: true }, 'Post liked'));
}

export async function unlikePost(request: Request, response: Response): Promise<void> {
  const userId = request.user?.userId;
  if (!userId) {
    throw new AppError({
      message: 'User not authenticated',
      statusCode: 401,
      code: 'UNAUTHORIZED',
    });
  }

  const postId = Array.isArray(request.params.postId)
    ? request.params.postId[0]
    : request.params.postId;
  if (!postId) {
    throw new AppError({
      message: 'Post ID is required',
      statusCode: 400,
      code: 'MISSING_POST_ID',
    });
  }

  await postService.unlikePost(userId, postId);
  response.status(200).json(createSuccessResponse({ success: true }, 'Post unliked'));
}

export async function getPostLikeStatus(request: Request, response: Response): Promise<void> {
  const userId = request.user?.userId;
  if (!userId) {
    throw new AppError({
      message: 'User not authenticated',
      statusCode: 401,
      code: 'UNAUTHORIZED',
    });
  }

  const postId = Array.isArray(request.params.postId)
    ? request.params.postId[0]
    : request.params.postId;
  if (!postId) {
    throw new AppError({
      message: 'Post ID is required',
      statusCode: 400,
      code: 'MISSING_POST_ID',
    });
  }

  const status = await postService.getPostLikeStatus(userId, postId);
  response.status(200).json(createSuccessResponse(status, 'Like status retrieved'));
}

export async function bookmarkPost(request: Request, response: Response): Promise<void> {
  const userId = request.user?.userId;
  if (!userId) {
    throw new AppError({
      message: 'User not authenticated',
      statusCode: 401,
      code: 'UNAUTHORIZED',
    });
  }

  const postId = Array.isArray(request.params.postId)
    ? request.params.postId[0]
    : request.params.postId;
  if (!postId) {
    throw new AppError({
      message: 'Post ID is required',
      statusCode: 400,
      code: 'MISSING_POST_ID',
    });
  }

  await postService.bookmarkPost(userId, postId);
  response.status(201).json(createSuccessResponse({ success: true }, 'Post bookmarked'));
}

export async function unbookmarkPost(request: Request, response: Response): Promise<void> {
  const userId = request.user?.userId;
  if (!userId) {
    throw new AppError({
      message: 'User not authenticated',
      statusCode: 401,
      code: 'UNAUTHORIZED',
    });
  }

  const postId = Array.isArray(request.params.postId)
    ? request.params.postId[0]
    : request.params.postId;
  if (!postId) {
    throw new AppError({
      message: 'Post ID is required',
      statusCode: 400,
      code: 'MISSING_POST_ID',
    });
  }

  await postService.unbookmarkPost(userId, postId);
  response.status(200).json(createSuccessResponse({ success: true }, 'Post unbookmarked'));
}

export async function getPostBookmarkStatus(request: Request, response: Response): Promise<void> {
  const userId = request.user?.userId;
  if (!userId) {
    throw new AppError({
      message: 'User not authenticated',
      statusCode: 401,
      code: 'UNAUTHORIZED',
    });
  }

  const postId = Array.isArray(request.params.postId)
    ? request.params.postId[0]
    : request.params.postId;
  if (!postId) {
    throw new AppError({
      message: 'Post ID is required',
      statusCode: 400,
      code: 'MISSING_POST_ID',
    });
  }

  const status = await postService.getPostBookmarkStatus(userId, postId);
  response.status(200).json(createSuccessResponse(status, 'Bookmark status retrieved'));
}

export async function createComment(request: Request, response: Response): Promise<void> {
  const userId = request.user?.userId;
  if (!userId) {
    throw new AppError({
      message: 'User not authenticated',
      statusCode: 401,
      code: 'UNAUTHORIZED',
    });
  }

  const postId = Array.isArray(request.params.postId)
    ? request.params.postId[0]
    : request.params.postId;
  if (!postId) {
    throw new AppError({
      message: 'Post ID is required',
      statusCode: 400,
      code: 'MISSING_POST_ID',
    });
  }

  const validation = createCommentSchema.safeParse(request.body);
  if (!validation.success) {
    response.status(400).json(
      createErrorResponse({
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        details: validation.error.flatten(),
      }),
    );
    return;
  }

  const replyToId = request.body.replyToId as string | undefined;
  const comment = await postService.createComment(userId, postId, validation.data, replyToId);
  response.status(201).json(createSuccessResponse(comment, 'Comment created'));
}

export async function getPostComments(request: Request, response: Response): Promise<void> {
  const postId = Array.isArray(request.params.postId)
    ? request.params.postId[0]
    : request.params.postId;
  if (!postId) {
    throw new AppError({
      message: 'Post ID is required',
      statusCode: 400,
      code: 'MISSING_POST_ID',
    });
  }

  const limit = Math.min(parseInt(request.query.limit as string) || 20, 100);
  const skip = Math.max(parseInt(request.query.skip as string) || 0, 0);

  const comments = await postService.getPostComments(postId, limit, skip);
  response.status(200).json(createSuccessResponse(comments, 'Comments retrieved'));
}

export async function deleteComment(request: Request, response: Response): Promise<void> {
  const userId = request.user?.userId;
  if (!userId) {
    throw new AppError({
      message: 'User not authenticated',
      statusCode: 401,
      code: 'UNAUTHORIZED',
    });
  }

  const commentId = Array.isArray(request.params.commentId)
    ? request.params.commentId[0]
    : request.params.commentId;
  if (!commentId) {
    throw new AppError({
      message: 'Comment ID is required',
      statusCode: 400,
      code: 'MISSING_COMMENT_ID',
    });
  }

  await postService.deleteComment(userId, commentId);
  response.status(200).json(createSuccessResponse({ success: true }, 'Comment deleted'));
}

export async function likeComment(request: Request, response: Response): Promise<void> {
  const userId = request.user?.userId;
  if (!userId) {
    throw new AppError({
      message: 'User not authenticated',
      statusCode: 401,
      code: 'UNAUTHORIZED',
    });
  }

  const commentId = Array.isArray(request.params.commentId)
    ? request.params.commentId[0]
    : request.params.commentId;
  if (!commentId) {
    throw new AppError({
      message: 'Comment ID is required',
      statusCode: 400,
      code: 'MISSING_COMMENT_ID',
    });
  }

  await postService.likeComment(userId, commentId);
  response.status(201).json(createSuccessResponse({ success: true }, 'Comment liked'));
}

export async function unlikeComment(request: Request, response: Response): Promise<void> {
  const userId = request.user?.userId;
  if (!userId) {
    throw new AppError({
      message: 'User not authenticated',
      statusCode: 401,
      code: 'UNAUTHORIZED',
    });
  }

  const commentId = Array.isArray(request.params.commentId)
    ? request.params.commentId[0]
    : request.params.commentId;
  if (!commentId) {
    throw new AppError({
      message: 'Comment ID is required',
      statusCode: 400,
      code: 'MISSING_COMMENT_ID',
    });
  }

  await postService.unlikeComment(userId, commentId);
  response.status(200).json(createSuccessResponse({ success: true }, 'Comment unliked'));
}

export async function getCommentLikeStatus(request: Request, response: Response): Promise<void> {
  const userId = request.user?.userId;
  if (!userId) {
    throw new AppError({
      message: 'User not authenticated',
      statusCode: 401,
      code: 'UNAUTHORIZED',
    });
  }

  const commentId = Array.isArray(request.params.commentId)
    ? request.params.commentId[0]
    : request.params.commentId;
  if (!commentId) {
    throw new AppError({
      message: 'Comment ID is required',
      statusCode: 400,
      code: 'MISSING_COMMENT_ID',
    });
  }

  const status = await postService.getCommentLikeStatus(userId, commentId);
  response.status(200).json(createSuccessResponse(status, 'Like status retrieved'));
}
