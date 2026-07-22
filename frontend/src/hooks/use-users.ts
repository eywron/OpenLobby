import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { User, ApiResponse, PaginatedResponse } from '@/types';

export const useUserProfile = (username: string) => {
  return useQuery({
    queryKey: ['users', username],
    queryFn: async () => {
      const res = await api.get<ApiResponse<User>>(`/users/${username}`);
      return res.data;
    },
  });
};

export const useFollowStatus = (userId: string) => {
  return useQuery({
    queryKey: ['follow-status', userId],
    queryFn: async () => {
      const res = await api.get<ApiResponse<{ isFollowing: boolean }>>(
        `/users/${userId}/follow-status`,
      );
      return res.data;
    },
  });
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ targetUserId }: { targetUserId: string }) => {
      await api.post(`/users/me/follow`, { targetUserId });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['follow-status', variables.targetUserId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      await api.delete(`/users/${userId}/unfollow`);
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['follow-status', userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useFollowers = (userId: string, limit = 20) => {
  return useInfiniteQuery({
    queryKey: ['followers', userId],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await api.get<ApiResponse<PaginatedResponse<User>>>(
        `/users/${userId}/followers?limit=${limit}&skip=${pageParam}`,
      );
      return res.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.hasMore) {
        return allPages.length * limit;
      }
      return undefined;
    },
    initialPageParam: 0,
  });
};

export const useFollowing = (userId: string, limit = 20) => {
  return useInfiniteQuery({
    queryKey: ['following', userId],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await api.get<ApiResponse<PaginatedResponse<User>>>(
        `/users/${userId}/following?limit=${limit}&skip=${pageParam}`,
      );
      return res.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.hasMore) {
        return allPages.length * limit;
      }
      return undefined;
    },
    initialPageParam: 0,
  });
};
