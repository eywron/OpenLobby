"use client";

import { useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bookmark } from "lucide-react";

// Simplified inline PostCard in case the main one isn't ready
function SimplePostCard({ post }: { post: any }) {
  return (
    <Card className="mb-4 bg-background border-border hover:bg-secondary/10 transition-colors">
      <CardContent className="p-4">
        <Link href={`/post/${post.id}`} className="block">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={post.author?.avatarUrl} />
              <AvatarFallback>{post.author?.displayName?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-foreground">{post.author?.displayName}</div>
              <div className="text-sm text-muted-foreground">@{post.author?.username}</div>
            </div>
          </div>
          <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
        </Link>
      </CardContent>
    </Card>
  );
}

function BookmarksPageContent() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useBookmarks();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const bookmarks = data?.pages.flatMap((p) => p.posts) || [];

  return (
    <div className="max-w-2xl mx-auto border-x border-border min-h-[calc(100vh-4rem)] bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm p-4 border-b border-border flex items-center gap-2">
        <Bookmark className="w-5 h-5 text-foreground" />
        <h1 className="text-xl font-semibold text-foreground">Bookmarks</h1>
      </div>

      <div className="p-4">
        {isError ? (
          <div className="text-center py-12 text-muted-foreground">
            <Bookmark className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <h2 className="text-lg font-medium mb-2">Bookmarks feature coming soon</h2>
            <p className="text-sm">We are working on bringing this feature to you.</p>
          </div>
        ) : isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="mb-4 bg-background border-border">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </CardContent>
            </Card>
          ))
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Bookmark className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <h2 className="text-lg font-medium mb-2">No bookmarks yet</h2>
            <p className="text-sm">Save posts to read later.</p>
          </div>
        ) : (
          bookmarks.map((post, idx) => (
            <SimplePostCard key={post.id || idx} post={post} />
          ))
        )}

        <div ref={loadMoreRef} className="h-10" />
        {isFetchingNextPage && (
          <div className="p-4 text-center">
            <Skeleton className="h-4 w-24 mx-auto" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookmarksPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading bookmarks...</div>}>
      <BookmarksPageContent />
    </Suspense>
  );
}
