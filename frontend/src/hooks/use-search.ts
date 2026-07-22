import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface SearchUser {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
}

export interface SearchResult {
  users?: SearchUser[];
  posts?: any[];
  hashtags?: Array<{ name: string; count: number }>;
}

export function useSearch(
  query: string,
  type: 'users' | 'posts' | 'hashtags' | 'all' = 'all',
  limit: number = 20,
) {
  return useQuery({
    queryKey: ['search', query, type, limit],
    queryFn: async () => {
      const response = await api.get<{ data: SearchResult }>(
        `/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}`,
      );
      return response.data;
    },
    enabled: query.length > 0,
  });
}
