import * as searchRepository from "../repositories/search.repository";
import type { SearchQuery } from "../schemas/search.schema";

export async function search(query: SearchQuery) {
	const { q, type, limit, skip } = query;

	switch (type) {
		case "users":
			return searchRepository.searchUsers(q, limit, skip);
		case "posts":
			return searchRepository.searchPosts(q, limit, skip);
		case "hashtags":
			return searchRepository.searchHashtags(q, limit, skip);
		default:
			return [];
	}
}
