"use client";

import { useState, useEffect, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { PenSquare, Send, Search } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import {
  useConversations,
  useMessages,
  useSendMessage,
  useStartConversation,
  useMarkAsRead,
} from "@/hooks/use-messages";
import { useSearch } from "@/hooks/use-search";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
  const { user } = useAuth();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isNewDialogOpenned, setIsNewDialogOpenned] = useState(false);

  const { data: conversations, isLoading: isLoadingConversations } = useConversations();
  const markAsRead = useMarkAsRead(activeConversationId || "");

  useEffect(() => {
    if (activeConversationId) {
      markAsRead.mutate();
    }
  }, [activeConversationId]);

  const activeConversation = conversations?.find((c) => c.id === activeConversationId);
  const otherParticipant = activeConversation?.participants.find((p) => p.id !== user?.id);

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Left Panel: Conversation List */}
      <div
        className={cn(
          "w-full md:w-1/3 flex-shrink-0 flex flex-col border-r border-border h-full",
          activeConversationId ? "hidden md:flex" : "flex"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Messages</h2>
          <NewConversationDialog
            onSelect={(convId) => {
              setActiveConversationId(convId);
              setIsNewDialogOpenned(false);
            }}
            open={isNewDialogOpenned}
            onOpenChange={setIsNewDialogOpenned}
          />
        </div>
        <ScrollArea className="flex-1">
          {isLoadingConversations ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-4 border-b border-border flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
            ))
          ) : conversations?.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No conversations yet</div>
          ) : (
            conversations?.map((conv) => {
              const other = conv.participants.find((p) => p.id !== user?.id);
              const isUnread = conv.unreadCount > 0;
              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={cn(
                    "w-full p-4 border-b border-border flex items-center gap-3 hover:bg-secondary/50 transition-colors text-left",
                    activeConversationId === conv.id ? "bg-secondary" : ""
                  )}
                >
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={other?.avatarUrl} />
                    <AvatarFallback>{other?.displayName?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-foreground truncate">{other?.displayName}</span>
                      {conv.lastMessage && (
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                          {formatDistanceToNow(new Date(conv.lastMessage.createdAt), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground truncate flex-1">
                        {conv.lastMessage?.content || "No messages yet"}
                      </span>
                      {isUnread && <div className="w-2 h-2 rounded-full bg-destructive ml-2 flex-shrink-0" />}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </ScrollArea>
      </div>

      {/* Right Panel: Chat View */}
      <div
        className={cn(
          "flex-1 flex flex-col h-full bg-background",
          !activeConversationId ? "hidden md:flex items-center justify-center" : "flex"
        )}
      >
        {!activeConversationId ? (
          <div className="text-muted-foreground">Select a conversation or start a new one</div>
        ) : (
          <>
            <div className="flex items-center p-4 border-b border-border gap-3 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden mr-2"
                onClick={() => setActiveConversationId(null)}
              >
                &larr;
              </Button>
              <Avatar className="w-10 h-10">
                <AvatarImage src={otherParticipant?.avatarUrl} />
                <AvatarFallback>{otherParticipant?.displayName?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-foreground">{otherParticipant?.displayName}</div>
                <div className="text-xs text-muted-foreground">@{otherParticipant?.username}</div>
              </div>
            </div>
            
            <ChatMessages conversationId={activeConversationId} userId={user?.id} />
            <ChatInput conversationId={activeConversationId} />
          </>
        )}
      </div>
    </div>
  );
}

function ChatMessages({ conversationId, userId }: { conversationId: string; userId: string | undefined }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useMessages(conversationId);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Extract messages and reverse for display (oldest at top, newest at bottom)
  const messages = data?.pages.flatMap((p) => p.messages).reverse() || [];

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <Skeleton className="h-10 w-2/3 ml-auto rounded-2xl" />
        <Skeleton className="h-10 w-2/3 mr-auto rounded-2xl" />
        <Skeleton className="h-16 w-3/4 mr-auto rounded-2xl" />
      </div>
    );
  }

  return (
    <div 
      className="flex-1 p-4 overflow-y-auto flex flex-col"
      onScroll={handleScroll}
      ref={scrollRef}
    >
      {isFetchingNextPage && <div className="text-center text-xs text-muted-foreground my-2">Loading older...</div>}
      {messages.map((msg) => {
        const isMe = msg.senderId === userId;
        return (
          <div
            key={msg.id}
            className={cn(
              "max-w-[75%] px-4 py-2 rounded-2xl mb-4 break-words",
              isMe ? "bg-primary text-primary-foreground ml-auto" : "bg-secondary text-foreground mr-auto"
            )}
          >
            <div>{msg.content}</div>
            <div
              className={cn(
                "text-[10px] mt-1 text-right",
                isMe ? "text-primary-foreground/70" : "text-muted-foreground"
              )}
            >
              {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}

function ChatInput({ conversationId }: { conversationId: string }) {
  const [text, setText] = useState("");
  const sendMessage = useSendMessage(conversationId);

  const handleSend = () => {
    if (!text.trim() || sendMessage.isPending) return;
    sendMessage.mutate(text.trim(), {
      onSuccess: () => setText(""),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-border flex items-end gap-2 flex-shrink-0">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="min-h-[44px] max-h-[120px] resize-none py-3"
        rows={1}
      />
      <Button
        size="icon"
        onClick={handleSend}
        disabled={!text.trim() || sendMessage.isPending}
        className="mb-0.5 rounded-full"
      >
        <Send className="w-4 h-4" />
      </Button>
    </div>
  );
}

function NewConversationDialog({ 
  onSelect,
  open,
  onOpenChange
}: { 
  onSelect: (convId: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = useSearch(debouncedSearch, "users");
  const startConversation = useStartConversation();

  const handleUserClick = (userId: string) => {
    startConversation.mutate(userId, {
      onSuccess: (data) => {
        onSelect(data.id);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <PenSquare className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="max-h-[300px]">
          {isLoading && search.length > 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Searching...</div>
          ) : data?.users && data.users.length > 0 ? (
            <div className="p-2">
              {data.users.map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleUserClick(u.id)}
                  className="w-full flex items-center gap-3 p-2 hover:bg-secondary rounded-md transition-colors text-left"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={u.avatarUrl} />
                    <AvatarFallback>{u.displayName?.[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-foreground">{u.displayName}</div>
                    <div className="text-sm text-muted-foreground">@{u.username}</div>
                  </div>
                </button>
              ))}
            </div>
          ) : search.length > 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">No users found</div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">Type to search for users</div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
