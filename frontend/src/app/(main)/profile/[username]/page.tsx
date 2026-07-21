'use client';

import { useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUserProfile, useFollowStatus, useFollowUser, useUnfollowUser } from '@/hooks/use-users';
import { useUserPosts } from '@/hooks/use-posts';
import { useAuth } from '@/providers/auth-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { PostCard } from '@/features/posts/post-card';
import { PostSkeleton } from '@/features/posts/post-skeleton';
import { getInitials } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const router = useRouter();
  
  const { user: currentUser } = useAuth();
  
  const { data: profileResponse, isLoading: profileLoading } = useUserProfile(username);
  const profile = profileResponse;
  
  const isOwnProfile = currentUser?.username === username;
  
  const { data: followStatusResponse } = useFollowStatus(profile?.id || '');
  const isFollowing = followStatusResponse?.isFollowing ?? false;
  
  const followMutation = useFollowUser();
  const unfollowMutation = useUnfollowUser();

  const handleFollowToggle = () => {
    if (!profile) return;
    if (isFollowing) {
      unfollowMutation.mutate(profile.id);
    } else {
      followMutation.mutate({ targetUserId: profile.id });
    }
  };

  // Posts Tab
  const { 
    data: postsData, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    status: postsStatus
  } = useUserPosts(profile?.id || '', 10);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profile) return;
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
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, profile]);

  if (profileLoading) {
    return (
      <div className="flex flex-col">
        <Skeleton className="h-48 w-full rounded-none" />
        <div className="px-4 pb-4">
          <div className="flex justify-between items-start">
            <Skeleton className="h-24 w-24 rounded-full -mt-12 border-4 border-background" />
            <Skeleton className="h-10 w-24 mt-4" />
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <div className="p-8 text-center text-muted-foreground">User not found</div>;
  }

  const posts = postsData?.pages.flatMap(page => page.items) || [];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-48 w-full bg-secondary relative">
        {profile.bannerUrl && (
          <Image src={profile.bannerUrl} alt="Banner" fill className="object-cover" />
        )}
      </div>
      
      <div className="px-4 pb-4">
        <div className="flex justify-between items-start">
          <Avatar className="h-24 w-24 -mt-12 border-4 border-background relative z-10">
            {profile.avatarUrl ? (
              <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
            ) : null}
            <AvatarFallback className="text-2xl">{getInitials(profile.displayName || profile.username)}</AvatarFallback>
          </Avatar>
          
          <div className="mt-4">
            {isOwnProfile ? (
              <Button variant="outline" onClick={() => router.push('/settings')}>Edit Profile</Button>
            ) : (
              <Button 
                variant={isFollowing ? "secondary" : "outline"} 
                onClick={handleFollowToggle}
                className={isFollowing ? "hover:bg-destructive hover:text-destructive-foreground hover:border-destructive group" : ""}
              >
                {isFollowing ? (
                  <>
                    <span className="group-hover:hidden">Following</span>
                    <span className="hidden group-hover:inline">Unfollow</span>
                  </>
                ) : 'Follow'}
              </Button>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <h1 className="text-xl font-bold">{profile.displayName}</h1>
          <p className="text-muted-foreground">@{profile.username}</p>
          
          {profile.bio && (
            <p className="mt-4 text-sm whitespace-pre-wrap">{profile.bio}</p>
          )}
          
          <div className="flex items-center space-x-4 mt-4 text-sm">
            <div className="flex items-center space-x-1 cursor-pointer hover:underline">
              <span className="font-bold">0</span>
              <span className="text-muted-foreground">Posts</span>
            </div>
            <div className="flex items-center space-x-1 cursor-pointer hover:underline">
              <span className="font-bold">0</span>
              <span className="text-muted-foreground">Followers</span>
            </div>
            <div className="flex items-center space-x-1 cursor-pointer hover:underline">
              <span className="font-bold">0</span>
              <span className="text-muted-foreground">Following</span>
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent h-12 p-0">
          <TabsTrigger value="posts" className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:shadow-none">Posts</TabsTrigger>
          <TabsTrigger value="media" className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:shadow-none">Media</TabsTrigger>
          <TabsTrigger value="likes" className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:shadow-none">Likes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="m-0">
          {postsStatus === 'pending' ? (
            <>
              <PostSkeleton />
              <PostSkeleton />
            </>
          ) : posts.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              @{profile.username} hasn't posted anything yet.
            </div>
          ) : (
            posts.map(post => <PostCard key={post.id} post={post} />)
          )}
          
          <div ref={bottomRef} className="h-10 flex items-center justify-center">
            {isFetchingNextPage && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
          </div>
        </TabsContent>
        
        <TabsContent value="media" className="m-0 p-4">
          <div className="grid grid-cols-3 gap-1">
            {/* Media grid placeholder */}
            <div className="aspect-square bg-secondary rounded-sm"></div>
            <div className="aspect-square bg-secondary rounded-sm"></div>
            <div className="aspect-square bg-secondary rounded-sm"></div>
          </div>
        </TabsContent>
        
        <TabsContent value="likes" className="m-0 p-8 text-center text-muted-foreground">
          Likes are private or not implemented yet.
        </TabsContent>
      </Tabs>
    </div>
  );
}
