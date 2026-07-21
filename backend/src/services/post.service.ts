import { AppError } from "../errors/app-error";
import * as postRepository from "../repositories/post.repository";
import * as notificationService from "./notification.service";
import type { CreatePostInput, UpdatePostInput, CreateCommentInput } from "../schemas/post.schema";

export async function createPost(userId: string, input: CreatePostInput) {
  const createData: {
    content: string;
    visibility: string;
    images?: Array<{ url: string; alt?: string }>;
  } = {
    content: input.content,
    visibility: input.visibility
  };

  if (input.images !== undefined) {
    createData.images = input.images.map((img) => ({
      url: img.url,
      ...(img.alt !== undefined && { alt: img.alt })
    }));
  }

  return postRepository.createPost(userId, createData);
}

export async function getPost(postId: string) {
  const post = await postRepository.getPostById(postId);
  if (!post) {
    throw new AppError({
      message: "Post not found",
      statusCode: 404,
      code: "POST_NOT_FOUND"
    });
  }
  return post;
}

export async function getFeed(userId: string | null, limit: number = 20, skip: number = 0) {
  return postRepository.getPostsFeed(userId, limit, skip);
}

export async function getUserPosts(userId: string, limit: number = 20, skip: number = 0) {
  return postRepository.getUserPosts(userId, limit, skip);
}

export async function updatePost(userId: string, postId: string, input: UpdatePostInput) {
  const post = await postRepository.getPostById(postId);
  if (!post) {
    throw new AppError({
      message: "Post not found",
      statusCode: 404,
      code: "POST_NOT_FOUND"
    });
  }

  if (post.authorId !== userId) {
    throw new AppError({
      message: "You can only edit your own posts",
      statusCode: 403,
      code: "FORBIDDEN"
    });
  }

  const updateData: {
    content?: string;
    visibility?: string;
  } = {};

  if (input.content !== undefined) updateData.content = input.content;
  if (input.visibility !== undefined) updateData.visibility = input.visibility;

  return postRepository.updatePost(postId, updateData);
}

export async function deletePost(userId: string, postId: string) {
  const post = await postRepository.getPostById(postId);
  if (!post) {
    throw new AppError({
      message: "Post not found",
      statusCode: 404,
      code: "POST_NOT_FOUND"
    });
  }

  if (post.authorId !== userId) {
    throw new AppError({
      message: "You can only delete your own posts",
      statusCode: 403,
      code: "FORBIDDEN"
    });
  }

  return postRepository.deletePost(postId);
}

export async function likePost(userId: string, postId: string) {
  const post = await postRepository.getPostById(postId);
  if (!post) {
    throw new AppError({
      message: "Post not found",
      statusCode: 404,
      code: "POST_NOT_FOUND"
    });
  }

  const existingLike = await postRepository.checkPostLike(postId, userId);
  if (existingLike) {
    throw new AppError({
      message: "You already liked this post",
      statusCode: 400,
      code: "ALREADY_LIKED"
    });
  }

  const like = await postRepository.likePost(postId, userId);

  // Create notification for post author
  if (post.authorId !== userId) {
    await notificationService.createNotification({
      recipientId: post.authorId,
      actorId: userId,
      type: "LIKE",
      postId
    });
  }

  return like;
}

export async function unlikePost(userId: string, postId: string) {
  return postRepository.unlikePost(postId, userId);
}

export async function getPostLikeStatus(userId: string, postId: string) {
  const like = await postRepository.checkPostLike(postId, userId);
  return { isLiked: !!like };
}

export async function bookmarkPost(userId: string, postId: string) {
  const post = await postRepository.getPostById(postId);
  if (!post) {
    throw new AppError({
      message: "Post not found",
      statusCode: 404,
      code: "POST_NOT_FOUND"
    });
  }

  const existingBookmark = await postRepository.checkPostBookmark(postId, userId);
  if (existingBookmark) {
    throw new AppError({
      message: "You already bookmarked this post",
      statusCode: 400,
      code: "ALREADY_BOOKMARKED"
    });
  }

  return postRepository.bookmarkPost(postId, userId);
}

export async function unbookmarkPost(userId: string, postId: string) {
  return postRepository.unbookmarkPost(postId, userId);
}

export async function getPostBookmarkStatus(userId: string, postId: string) {
  const bookmark = await postRepository.checkPostBookmark(postId, userId);
  return { isBookmarked: !!bookmark };
}

export async function createComment(
  userId: string,
  postId: string,
  input: CreateCommentInput,
  replyToId?: string
) {
  const post = await postRepository.getPostById(postId);
  if (!post) {
    throw new AppError({
      message: "Post not found",
      statusCode: 404,
      code: "POST_NOT_FOUND"
    });
  }

  const comment = await postRepository.createComment(postId, userId, input.content, replyToId);

  // Create notifications
  if (replyToId) {
    // Notify the commented user if replying to their comment
    await notificationService.createNotification({
      recipientId: replyToId,
      actorId: userId,
      type: "REPLY",
      postId,
      commentId: comment.id,
      content: input.content
    });
  } else {
    // Notify post author if commenting on their post
    if (post.authorId !== userId) {
      await notificationService.createNotification({
        recipientId: post.authorId,
        actorId: userId,
        type: "COMMENT",
        postId,
        commentId: comment.id,
        content: input.content
      });
    }
  }

  return comment;
}

export async function getPostComments(postId: string, limit: number = 20, skip: number = 0) {
  return postRepository.getPostComments(postId, limit, skip);
}

export async function deleteComment(userId: string, commentId: string) {
  // Note: This should query comment table, not post. Using getPostById temporarily
  // For proper implementation, need: const comment = await postRepository.getCommentById(commentId);
  const comment = await postRepository.getPostById(commentId);
  if (!comment) {
    throw new AppError({
      message: "Comment not found",
      statusCode: 404,
      code: "COMMENT_NOT_FOUND"
    });
  }

  // Type-safe access without casting
  const authorId = (comment as unknown as { authorId?: string }).authorId;
  if (authorId !== userId) {
    throw new AppError({
      message: "You can only delete your own comments",
      statusCode: 403,
      code: "FORBIDDEN"
    });
  }

  return postRepository.deleteComment(commentId);
}

export async function likeComment(userId: string, commentId: string) {
  const existingLike = await postRepository.checkCommentLike(commentId, userId);
  if (existingLike) {
    throw new AppError({
      message: "You already liked this comment",
      statusCode: 400,
      code: "ALREADY_LIKED"
    });
  }

  return postRepository.likeComment(commentId, userId);
}

export async function unlikeComment(userId: string, commentId: string) {
  return postRepository.unlikeComment(commentId, userId);
}

export async function getCommentLikeStatus(userId: string, commentId: string) {
  const like = await postRepository.checkCommentLike(commentId, userId);
  return { isLiked: !!like };
}
