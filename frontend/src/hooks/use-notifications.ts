import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Notification {
  id: string;
  type: "LIKE" | "COMMENT" | "FOLLOW" | "REPLY" | "MENTION";
  actor: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
  };
  isRead: boolean;
  createdAt: string;
  targetId?: string; // e.g. postId or commentId
}

export function useNotifications() {
  return useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await api.get<{ data: { notifications: Notification[]; nextSkip?: number } }>(
        `/notifications?limit=20&skip=${pageParam}`
      );
      return response.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextSkip,
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ["unreadCount", "notifications"],
    queryFn: async () => {
      const response = await api.get<{ data: { unreadCount: number } }>("/notifications/unread-count");
      return response.data.unreadCount;
    },
    refetchInterval: 30000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post<any>(`/notifications/${id}/read`, { notificationId: id });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadCount", "notifications"] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await api.post<any>("/notifications/read-all", {});
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadCount", "notifications"] });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete<any>(`/notifications/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadCount", "notifications"] });
    },
  });
}
