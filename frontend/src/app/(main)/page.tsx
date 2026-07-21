'use client';

import { useEffect, useRef } from 'react';
import { useFeed } from '@/hooks/use-posts';
import { CreatePostForm } from '@/features/posts/create-post-form';
import { PostCard } from '@/features/posts/post-card';
import { PostSkeleton } from '@/features/posts/post-skeleton';
import { Loader2 } from 'lucide-react';

export default function HomeFeedPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useFeed(10);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.length > 0 && entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === 'error') {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Something went wrong. Try refreshing.
      </div>
    );
  }

  const posts = data?.pages.flatMap(page => page.items) || [];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="hidden sm:block text-center text-xs text-muted-foreground py-2 border-b border-border">
        Pull down to refresh
      </div>
      
      <CreatePostForm />

      <div className="flex-1">
        {status === 'pending' ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No posts yet. Follow some users or create your first post!
          </div>
        ) : (
          posts.map(post => <PostCard key={post.id} post={post} />)
        )}
        
        <div ref={bottomRef} className="h-10 flex items-center justify-center">
          {isFetchingNextPage && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
        </div>
      </div>
    </div>
  );
}
