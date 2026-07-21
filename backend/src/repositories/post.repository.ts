import { prisma } from "../lib/prisma";

export async function createPost(
  authorId: string,
  data: {
    content: string;
    visibility: string;
    images?: Array<{ url: string; alt?: string }>;
  }
) {
  return prisma.post.create({
    data: {
      content: data.content,
      visibility: data.visibility as "PUBLIC" | "FOLLOWERS" | "PRIVATE",
      authorId,
      images: data.images
        ? {
            createMany: {
              data: data.images
            }
          }
        : undefined
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true
        }
      },
      images: true,
      _count: {
        select: {
          likes: true,
          comments: true,
          bookmarks: true
        }
      }
    }
  });
}

export async function getPostById(postId: string) {
  return prisma.post.findUnique({
    where: { id: postId, deletedAt: null },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true
        }
      },
      images: true,
      _count: {
        select: {
          likes: true,
          comments: true,
          bookmarks: true
        }
      }
    }
  });
}

export async function getPostsFeed(userId: string | null, limit: number = 20, skip: number = 0) {
  const whereCondition: {
    deletedAt: null;
    OR?: Array<{ [key: string]: unknown }>;
    visibility?: string;
  } = {
    deletedAt: null
  };

  if (userId) {
    // Get posts from user and followed users
    whereCondition.OR = [
      { authorId: userId },
      {
        author: {
          followers: {
            some: {
              followerId: userId
            }
          }
        }
      },
      { visibility: "PUBLIC" }
    ];
  } else {
    // Anonymous users see only public posts
    whereCondition.visibility = "PUBLIC";
  }

  return prisma.post.findMany({
    where: whereCondition,
    include: {
      author: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true
        }
      },
      images: true,
      _count: {
        select: {
          likes: true,
          comments: true,
          bookmarks: true
        }
      }
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip
  });
}

export async function getUserPosts(userId: string, limit: number = 20, skip: number = 0) {
  return prisma.post.findMany({
    where: {
      authorId: userId,
      deletedAt: null
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true
        }
      },
      images: true,
      _count: {
        select: {
          likes: true,
          comments: true,
          bookmarks: true
        }
      }
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip
  });
}

export async function updatePost(
  postId: string,
  data: {
    content?: string;
    visibility?: string;
  }
) {
  const updateData: {
    content?: string;
    visibility?: "PUBLIC" | "FOLLOWERS" | "PRIVATE";
  } = {};

  if (data.content !== undefined) updateData.content = data.content;
  if (data.visibility !== undefined) {
    updateData.visibility = data.visibility as "PUBLIC" | "FOLLOWERS" | "PRIVATE";
  }

  return prisma.post.update({
    where: { id: postId },
    data: updateData,
    include: {
      author: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true
        }
      },
      images: true,
      _count: {
        select: {
          likes: true,
          comments: true,
          bookmarks: true
        }
      }
    }
  });
}

export async function deletePost(postId: string) {
  return prisma.post.update({
    where: { id: postId },
    data: { deletedAt: new Date() }
  });
}

export async function likePost(postId: string, userId: string) {
  return prisma.postLike.create({
    data: {
      postId,
      userId
    }
  });
}

export async function unlikePost(postId: string, userId: string) {
  return prisma.postLike.deleteMany({
    where: {
      postId,
      userId
    }
  });
}

export async function checkPostLike(postId: string, userId: string) {
  return prisma.postLike.findUnique({
    where: {
      postId_userId: {
        postId,
        userId
      }
    }
  });
}

export async function bookmarkPost(postId: string, userId: string) {
  return prisma.bookmark.create({
    data: {
      postId,
      userId
    }
  });
}

export async function unbookmarkPost(postId: string, userId: string) {
  return prisma.bookmark.deleteMany({
    where: {
      postId,
      userId
    }
  });
}

export async function checkPostBookmark(postId: string, userId: string) {
  return prisma.bookmark.findUnique({
    where: {
      postId_userId: {
        postId,
        userId
      }
    }
  });
}

export async function createComment(
  postId: string,
  authorId: string,
  content: string,
  replyToId?: string
) {
  return prisma.comment.create({
    data: {
      content,
      postId,
      authorId,
      replyToId
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true
        }
      },
      _count: {
        select: {
          likes: true,
          replies: true
        }
      }
    }
  });
}

export async function getPostComments(postId: string, limit: number = 20, skip: number = 0) {
  return prisma.comment.findMany({
    where: {
      postId,
      deletedAt: null,
      replyToId: null
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true
        }
      },
      replies: {
        include: {
          author: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true
            }
          },
          _count: {
            select: {
              likes: true
            }
          }
        },
        where: { deletedAt: null },
        orderBy: { createdAt: "asc" }
      },
      _count: {
        select: {
          likes: true,
          replies: true
        }
      }
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip
  });
}

export async function deleteComment(commentId: string) {
  return prisma.comment.update({
    where: { id: commentId },
    data: { deletedAt: new Date() }
  });
}

export async function likeComment(commentId: string, userId: string) {
  return prisma.commentLike.create({
    data: {
      commentId,
      userId
    }
  });
}

export async function unlikeComment(commentId: string, userId: string) {
  return prisma.commentLike.deleteMany({
    where: {
      commentId,
      userId
    }
  });
}

export async function checkCommentLike(commentId: string, userId: string) {
  return prisma.commentLike.findUnique({
    where: {
      commentId_userId: {
        commentId,
        userId
      }
    }
  });
}
