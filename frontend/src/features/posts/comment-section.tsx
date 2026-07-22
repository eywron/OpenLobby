'use client';

import { useState } from 'react';
import { useAuth } from '@/providers/auth-provider';
import {
  useComments,
  useCreateComment,
  useDeleteComment,
  
  
} from '@/hooks/use-comments';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatRelativeTime, getInitials,  formatCount } from '@/lib/utils';
import { Heart, Reply, Trash2, Loader2 } from 'lucide-react';
import { Comment } from '@/types';

interface CommentSectionProps {
  postId: string;
}

function CommentItem({ comment, postId }: { comment: Comment; postId: string }) {
  const { user } = useAuth();
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const createComment = useCreateComment();
  const deleteComment = useDeleteComment();

  const isOwnComment = user?.id === comment.authorId;

  const handleReplySubmit = () => {
    if (!replyContent.trim()) return;
    createComment.mutate(
      { postId, textContent: replyContent, parentId: comment.id },
      {
        onSuccess: () => {
          setIsReplying(false);
          setReplyContent('');
        },
      },
    );
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this comment?')) {
      deleteComment.mutate({ postId, commentId: comment.id });
    }
  };

  return (
    <div className="flex space-x-3 mt-4">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={comment.author.avatarUrl} alt={comment.author.displayName} />
        <AvatarFallback>
          {getInitials(comment.author.displayName || comment.author.username)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-sm">{comment.author.displayName}</span>
          <span className="text-muted-foreground text-xs">@{comment.author.username}</span>
          <span className="text-muted-foreground text-xs">
            · {formatRelativeTime(comment.createdAt)}
          </span>
        </div>
        <p className="text-sm whitespace-pre-wrap">{comment.textContent}</p>

        <div className="flex items-center space-x-4 pt-1 text-muted-foreground">
          <button className="flex items-center space-x-1 hover:text-foreground text-xs">
            <Heart className="h-3 w-3" />
            <span>{formatCount(comment._count.likes)}</span>
          </button>
          <button
            className="flex items-center space-x-1 hover:text-foreground text-xs"
            onClick={() => setIsReplying(!isReplying)}
          >
            <Reply className="h-3 w-3" />
            <span>Reply</span>
          </button>
          {isOwnComment && (
            <button
              className="flex items-center space-x-1 hover:text-destructive text-xs"
              onClick={handleDelete}
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>

        {isReplying && (
          <div className="mt-2 flex space-x-2">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="min-h-[60px] text-sm resize-none"
            />
            <Button
              size="sm"
              onClick={handleReplySubmit}
              disabled={!replyContent.trim() || createComment.isPending}
            >
              {createComment.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Reply'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { data, isLoading } = useComments(postId);
  const [content, setContent] = useState('');
  const createComment = useCreateComment();

  const handleCreateComment = () => {
    if (!content.trim()) return;
    createComment.mutate(
      { postId, textContent: content },
      {
        onSuccess: () => setContent(''),
      },
    );
  };

  const comments = data || [];

  // Basic threading: group by parentId
  const rootComments = comments.filter((c: Comment) => !c.parentId);
  const replies = comments.filter((c: Comment) => c.parentId);

  return (
    <div className="mt-4 pt-4 border-t border-border">
      <div className="flex space-x-2 mb-6">
        <Textarea
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[80px] resize-none"
        />
        <Button onClick={handleCreateComment} disabled={!content.trim() || createComment.isPending}>
          {createComment.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Comment'}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-4">
          {rootComments.map((comment: Comment) => (
            <div key={comment.id}>
              <CommentItem comment={comment} postId={postId} />

              {/* Render replies */}
              <div className="ml-10 mt-2 space-y-2 border-l-2 border-border pl-4">
                {replies
                  .filter((r: Comment) => r.parentId === comment.id)
                  .map((reply: Comment) => (
                    <CommentItem key={reply.id} comment={reply} postId={postId} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
