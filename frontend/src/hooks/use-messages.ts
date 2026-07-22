import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface Conversation {
  id: string;
  participants: Array<{
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
  }>;
  lastMessage?: {
    id: string;
    content: string;
    createdAt: string;
    senderId: string;
  };
  updatedAt: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  conversationId: string;
}

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const response = await api.get<{ data: Conversation[] }>('/conversations');
      return response.data;
    },
  });
}

export function useMessages(conversationId: string) {
  return useInfiniteQuery({
    queryKey: ['messages', conversationId],
    queryFn: async ({ pageParam }) => {
      const cursorParam = pageParam ? `&cursor=${pageParam}` : '';
      const response = await api.get<{ data: { messages: Message[]; nextCursor?: string } }>(
        `/conversations/${conversationId}/messages?limit=50${cursorParam}`,
      );
      return response.data;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!conversationId,
  });
}

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content: string) => {
      const response = await api.post<{ data: Message }>(
        `/conversations/${conversationId}/messages`,
        { content },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export function useStartConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (participantId: string) => {
      const response = await api.post<{ data: Conversation }>('/conversations', { participantId });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export function useMarkAsRead(conversationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await api.post<any>(`/conversations/${conversationId}/read`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount', 'messages'] });
    },
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ['unreadCount', 'messages'],
    queryFn: async () => {
      const response = await api.get<{ data: { unreadCount: number } }>('/messages/unread-count');
      return response.data.unreadCount;
    },
    refetchInterval: 30000,
  });
}
