import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Post, ApiResponse, PaginatedResponse } from '@/types';

export const useFeed = (limit = 10) => {
  return useInfiniteQuery({
    queryKey: ['posts', 'feed'],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await api.get<ApiResponse<PaginatedResponse<Post>>>(`/posts/feed?limit=${limit}&skip=${pageParam}`);
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

export const useUserPosts = (userId: string, limit = 10) => {
  return useInfiniteQuery({
    queryKey: ['posts', 'user', userId],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await api.get<ApiResponse<PaginatedResponse<Post>>>(`/posts/user/${userId}/posts?limit=${limit}&skip=${pageParam}`);
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

export const usePost = (postId: string) => {
  return useQuery({
    queryKey: ['posts', postId],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Post>>(`/posts/${postId}`);
      return res.data;
    },
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      // we need to use fetch directly or modify apiClient to handle FormData
      const token = (await import('@/lib/api')).getAccessToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/posts`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });
      if (!res.ok) {
        throw new Error('Failed to create post');
      }
      const data: ApiResponse<Post> = await res.json();
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', 'feed'] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      await api.delete(`/posts/${postId}`);
    },
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ['posts', 'feed'] });
      queryClient.invalidateQueries({ queryKey: ['posts', 'user'] });
      queryClient.invalidateQueries({ queryKey: ['posts', postId] });
    },
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (postId: string) => {
      await api.post(`/posts/${postId}/like`);
    },
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['like-status', postId] });
    },
  });
};

export const useUnlikePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (postId: string) => {
      await api.delete(`/posts/${postId}/like`);
    },
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['like-status', postId] });
    },
  });
};

export const useLikeStatus = (postId: string) => {
  return useQuery({
    queryKey: ['like-status', postId],
    queryFn: async () => {
      const res = await api.get<ApiResponse<{ isLiked: boolean }>>(`/posts/${postId}/like-status`);
      return res.data;
    },
  });
};

export const useBookmarkPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (postId: string) => {
      await api.post(`/posts/${postId}/bookmark`);
    },
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ['bookmark-status', postId] });
    },
  });
};

export const useUnbookmarkPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (postId: string) => {
      await api.delete(`/posts/${postId}/bookmark`);
    },
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ['bookmark-status', postId] });
    },
  });
};

export const useBookmarkStatus = (postId: string) => {
  return useQuery({
    queryKey: ['bookmark-status', postId],
    queryFn: async () => {
      const res = await api.get<ApiResponse<{ isBookmarked: boolean }>>(`/posts/${postId}/bookmark-status`);
      return res.data;
    },
  });
};
