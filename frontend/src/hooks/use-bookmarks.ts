import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useBookmarks() {
  return useInfiniteQuery({
    queryKey: ['bookmarks'],
    queryFn: async ({ pageParam = 0 }) => {
      // Endpoint to retrieve bookmarks based on task description
      const response = await api.get<{ data: { posts: any[]; nextSkip?: number } }>(
        `/posts/bookmarks?limit=10&skip=${pageParam}`,
      );
      return response.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextSkip,
  });
}
