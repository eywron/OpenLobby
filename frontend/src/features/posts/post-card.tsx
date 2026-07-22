'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MoreHorizontal, MessageCircle, Heart, Bookmark, Share2, Trash2 } from 'lucide-react';
import { Post } from '@/types';
import { cn, formatRelativeTime, formatCount, getInitials } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/providers/auth-provider';
import {
  useLikePost,
  useUnlikePost,
  useLikeStatus,
  useBookmarkPost,
  useUnbookmarkPost,
  useBookmarkStatus,
  useDeletePost,
} from '@/hooks/use-posts';

interface PostCardProps {
  post: Post;
  showActions?: boolean;
}

export function PostCard({ post, showActions = true }: PostCardProps) {
  const { user } = useAuth();
  const toast = ({ title }: any) => alert(title);

  const { data: likeStatus } = useLikeStatus(post.id);
  const { data: bookmarkStatus } = useBookmarkStatus(post.id);

  const likeMutation = useLikePost();
  const unlikeMutation = useUnlikePost();
  const bookmarkMutation = useBookmarkPost();
  const unbookmarkMutation = useUnbookmarkPost();
  const deleteMutation = useDeletePost();

  const isLiked = likeStatus?.isLiked ?? false;
  const isBookmarked = bookmarkStatus?.isBookmarked ?? false;
  const likesCount = post._count.likes;
  const isOwnPost = user?.id === post.authorId;

  const handleLike = () => {
    if (isLiked) {
      unlikeMutation.mutate(post.id);
    } else {
      likeMutation.mutate(post.id);
    }
  };

  const handleBookmark = () => {
    if (isBookmarked) {
      unbookmarkMutation.mutate(post.id);
    } else {
      bookmarkMutation.mutate(post.id);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
      if (typeof toast === 'function') {
        toast({ title: 'Link copied to clipboard' });
      }
    } catch (err) { console.error(err);}
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this post?')) {
      deleteMutation.mutate(post.id);
    }
  };

  const getImageGridClass = (count: number) => {
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-2';
    return 'grid-cols-2 grid-rows-2';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="p-4 border-b border-border bg-background hover:bg-secondary/50 transition-colors w-full"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <Link href={`/profile/${post.author.username}`}>
            <Avatar className="h-10 w-10">
              {post.author.avatarUrl ? (
                <AvatarImage src={post.author.avatarUrl} alt={post.author.displayName} />
              ) : null}
              <AvatarFallback>
                {getInitials(post.author.displayName || post.author.username)}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <Link
                href={`/profile/${post.author.username}`}
                className="font-semibold hover:underline"
              >
                {post.author.displayName}
              </Link>
              <Link
                href={`/profile/${post.author.username}`}
                className="text-muted-foreground text-sm"
              >
                @{post.author.username}
              </Link>
              <span className="text-muted-foreground text-sm">·</span>
              <span className="text-muted-foreground text-sm">
                {formatRelativeTime(post.createdAt)}
                {post.editedAt && <span className="ml-1">(edited)</span>}
              </span>
            </div>
          </div>
        </div>

        {isOwnPost && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="mt-3">
        {post.textContent && (
          <p className="whitespace-pre-wrap text-sm text-foreground mb-3 break-words">
            {post.textContent}
          </p>
        )}

        {post.images && post.images.length > 0 && (
          <div className={cn('grid gap-2 mb-3', getImageGridClass(post.images.length))}>
            {post.images.map((image, index) => (
              <div
                key={image.id}
                className={cn(
                  'relative rounded-xl overflow-hidden',
                  post.images.length === 1 ? 'aspect-video' : 'aspect-square',
                )}
              >
                <Image
                  src={image.storageUrl}
                  alt={`Post image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {showActions && (
        <div className="flex items-center justify-between text-muted-foreground mt-4">
          <Button variant="ghost" size="sm" className="space-x-2">
            <MessageCircle className="h-4 w-4" />
            <span>{formatCount(post._count.comments)}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={cn('space-x-2', isLiked && 'text-foreground')}
          >
            <Heart className={cn('h-4 w-4', isLiked && 'fill-foreground')} />
            <span>{formatCount(likesCount)}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            className={isBookmarked ? 'text-foreground' : ''}
          >
            <Bookmark className={cn('h-4 w-4', isBookmarked && 'fill-foreground')} />
          </Button>

          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </motion.div>
  );
}
