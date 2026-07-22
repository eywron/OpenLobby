import { Router } from 'express';

import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.middleware';
import * as postController from '../controllers/post.controller';

export const postRouter = Router();

// Post operations
postRouter.post('/', authMiddleware, postController.createPost);
postRouter.get('/feed', optionalAuthMiddleware, postController.getFeed);
postRouter.get('/:postId', postController.getPost);
postRouter.patch('/:postId', authMiddleware, postController.updatePost);
postRouter.delete('/:postId', authMiddleware, postController.deletePost);

// Post interactions
postRouter.post('/:postId/like', authMiddleware, postController.likePost);
postRouter.delete('/:postId/like', authMiddleware, postController.unlikePost);
postRouter.get('/:postId/like-status', authMiddleware, postController.getPostLikeStatus);

postRouter.post('/:postId/bookmark', authMiddleware, postController.bookmarkPost);
postRouter.delete('/:postId/bookmark', authMiddleware, postController.unbookmarkPost);
postRouter.get('/:postId/bookmark-status', authMiddleware, postController.getPostBookmarkStatus);

// Comments
postRouter.post('/:postId/comments', authMiddleware, postController.createComment);
postRouter.get('/:postId/comments', postController.getPostComments);
postRouter.delete('/:postId/comments/:commentId', authMiddleware, postController.deleteComment);

// Comment interactions
postRouter.post('/:postId/comments/:commentId/like', authMiddleware, postController.likeComment);
postRouter.delete(
  '/:postId/comments/:commentId/like',
  authMiddleware,
  postController.unlikeComment,
);
postRouter.get(
  '/:postId/comments/:commentId/like-status',
  authMiddleware,
  postController.getCommentLikeStatus,
);

// User's posts
postRouter.get('/user/:userId/posts', postController.getUserPosts);
