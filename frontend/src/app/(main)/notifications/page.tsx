'use client';

import { useEffect, useRef } from 'react';

import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { Check, Heart, MessageSquare, UserPlus, CornerDownRight, AtSign } from 'lucide-react';
import {
  useNotifications,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from '@/hooks/use-notifications';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function NotificationsPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useNotifications();
  const markAllRead = useMarkAllNotificationsRead();
  const markRead = useMarkNotificationRead();
  const router = useRouter();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const notifications = data?.pages.flatMap((p) => p.notifications) || [];

  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead) {
      markRead.mutate(notification.id);
    }

    // Navigate based on type
    if (notification.type === 'FOLLOW') {
      router.push(`/profile/${notification.actor.username}`);
    } else if (notification.targetId) {
      // Assuming posts are at /post/[id]
      router.push(`/post/${notification.targetId}`);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'LIKE':
        return <Heart className="w-4 h-4 text-muted-foreground" />;
      case 'COMMENT':
        return <MessageSquare className="w-4 h-4 text-muted-foreground" />;
      case 'FOLLOW':
        return <UserPlus className="w-4 h-4 text-muted-foreground" />;
      case 'REPLY':
        return <CornerDownRight className="w-4 h-4 text-muted-foreground" />;
      case 'MENTION':
        return <AtSign className="w-4 h-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const getText = (notification: any) => {
    const actorName = notification.actor.displayName;
    switch (notification.type) {
      case 'LIKE':
        return (
          <span className="text-foreground">
            <span className="font-semibold">{actorName}</span> liked your post
          </span>
        );
      case 'COMMENT':
        return (
          <span className="text-foreground">
            <span className="font-semibold">{actorName}</span> commented on your post
          </span>
        );
      case 'FOLLOW':
        return (
          <span className="text-foreground">
            <span className="font-semibold">{actorName}</span> followed you
          </span>
        );
      case 'REPLY':
        return (
          <span className="text-foreground">
            <span className="font-semibold">{actorName}</span> replied to your comment
          </span>
        );
      case 'MENTION':
        return (
          <span className="text-foreground">
            <span className="font-semibold">{actorName}</span> mentioned you
          </span>
        );
      default:
        return (
          <span className="text-foreground">
            <span className="font-semibold">{actorName}</span> interacted with you
          </span>
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto border-x border-border min-h-[calc(100vh-4rem)] bg-background">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm flex items-center justify-between p-4 border-b border-border">
        <h1 className="text-xl font-semibold text-foreground">Notifications</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => markAllRead.mutate()}
          disabled={markAllRead.isPending || notifications.every((n) => n.isRead)}
        >
          <Check className="w-4 h-4 mr-2" />
          Mark all read
        </Button>
      </div>

      <div className="divide-y divide-border">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 flex gap-4 items-start">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            All caught up! No notifications.
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={cn(
                'p-4 flex gap-4 items-start cursor-pointer transition-colors hover:bg-secondary/80',
                !notification.isRead ? 'bg-secondary/50' : 'bg-transparent',
              )}
            >
              <div className="mt-1">{getIcon(notification.type)}</div>
              <Avatar className="w-10 h-10">
                <AvatarImage src={notification.actor.avatarUrl} />
                <AvatarFallback>{notification.actor.displayName?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="text-sm">{getText(notification)}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </div>
              </div>
              {!notification.isRead && <div className="w-2 h-2 rounded-full bg-destructive mt-2" />}
            </div>
          ))
        )}

        {/* Load more trigger */}
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
