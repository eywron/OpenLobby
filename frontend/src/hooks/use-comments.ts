import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Comment, ApiResponse } from '@/types';

export const useComments = (postId: string) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Comment[]>>(`/posts/${postId}/comments`);
      return res.data;
    },
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, textContent, parentId }: { postId: string; textContent: string; parentId?: string }) => {
      const res = await api.post<ApiResponse<Comment>>(`/posts/${postId}/comments`, { textContent, parentId });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['posts', variables.postId] });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, commentId }: { postId: string; commentId: string }) => {
      await api.delete(`/posts/${postId}/comments/${commentId}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['posts', variables.postId] });
    },
  });
};

export const useLikeComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ postId, commentId }: { postId: string; commentId: string }) => {
      await api.post(`/posts/${postId}/comments/${commentId}/like`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
    },
  });
};

export const useUnlikeComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ postId, commentId }: { postId: string; commentId: string }) => {
      await api.delete(`/posts/${postId}/comments/${commentId}/like`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
    },
  });
};
