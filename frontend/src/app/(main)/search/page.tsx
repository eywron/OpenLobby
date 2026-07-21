"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search as SearchIcon, Hash, UserPlus } from "lucide-react";
import { useSearch } from "@/hooks/use-search";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

// Simplified inline PostCard in case the main one isn't ready
function SimplePostCard({ post }: { post: any }) {
  return (
    <Card className="mb-4 bg-background border-border">
      <CardContent className="p-4">
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
        <p className="text-foreground">{post.content}</p>
      </CardContent>
    </Card>
  );
}

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<"users" | "posts" | "hashtags">("users");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      if (query) {
        const params = new URLSearchParams(searchParams);
        params.set("q", query);
        router.replace(`/search?${params.toString()}`);
      } else {
        router.replace("/search");
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, router, searchParams]);

  const { data, isLoading } = useSearch(debouncedQuery, activeTab, 20);

  return (
    <div className="max-w-2xl mx-auto border-x border-border min-h-[calc(100vh-4rem)] bg-background flex flex-col">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm p-4 border-b border-border">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search OpenLobby..."
            className="pl-10 py-6 text-lg bg-secondary/50 border-transparent focus:border-border rounded-xl"
            autoFocus
          />
        </div>
      </div>

      <div className="flex-1 p-4">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4 mt-0">
            {isLoading && debouncedQuery ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="bg-background border-border">
                  <CardContent className="p-4 flex items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : data?.users && data.users.length > 0 ? (
              data.users.map((user) => (
                <Card key={user.id} className="bg-background border-border hover:bg-secondary/20 transition-colors">
                  <CardContent className="p-4 flex items-center justify-between">
                    <Link href={`/profile/${user.username}`} className="flex items-center gap-3 flex-1 overflow-hidden">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback>{user.displayName?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-foreground truncate">{user.displayName}</div>
                        <div className="text-sm text-muted-foreground truncate">@{user.username}</div>
                        {user.bio && <div className="text-sm text-foreground mt-1 truncate">{user.bio}</div>}
                      </div>
                    </Link>
                    <Button variant="outline" size="sm" className="ml-4 flex-shrink-0">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Follow
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : debouncedQuery ? (
              <div className="text-center py-12 text-muted-foreground">
                No results found for "{debouncedQuery}"
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Enter a search query to find users
              </div>
            )}
          </TabsContent>

          <TabsContent value="posts" className="mt-0">
            {isLoading && debouncedQuery ? (
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
            ) : data?.posts && data.posts.length > 0 ? (
              data.posts.map((post) => (
                <SimplePostCard key={post.id} post={post} />
              ))
            ) : debouncedQuery ? (
              <div className="text-center py-12 text-muted-foreground">
                No results found for "{debouncedQuery}"
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Enter a search query to find posts
              </div>
            )}
          </TabsContent>

          <TabsContent value="hashtags" className="mt-0 space-y-2">
            {isLoading && debouncedQuery ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 border border-border rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-4 w-12" />
                </div>
              ))
            ) : data?.hashtags && data.hashtags.length > 0 ? (
              data.hashtags.map((tag) => (
                <Link 
                  key={tag.name} 
                  href={`/search?q=${encodeURIComponent('#' + tag.name)}`}
                  className="p-4 border border-border rounded-lg flex items-center justify-between hover:bg-secondary/20 transition-colors bg-background block"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-secondary p-2 rounded-full">
                      <Hash className="w-4 h-4 text-foreground" />
                    </div>
                    <div className="font-medium text-foreground">#{tag.name}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{tag.count} posts</div>
                </Link>
              ))
            ) : debouncedQuery ? (
              <div className="text-center py-12 text-muted-foreground">
                No results found for "{debouncedQuery}"
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Enter a search query to find hashtags
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading search...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
