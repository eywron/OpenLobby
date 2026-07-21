import { prisma } from "../lib/prisma";

export async function searchUsers(query: string, limit: number, skip: number) {
	return prisma.user.findMany({
		where: {
			accountStatus: { not: "DELETED" },
			OR: [
				{ username: { contains: query, mode: "insensitive" } },
				{ displayName: { contains: query, mode: "insensitive" } }
			]
		},
		select: {
			id: true,
			username: true,
			displayName: true,
			avatarUrl: true,
			bio: true
		},
		take: limit,
		skip: skip
	});
}

export async function searchPosts(query: string, limit: number, skip: number) {
	return prisma.post.findMany({
		where: {
			deletedAt: null,
			visibility: "PUBLIC",
			textContent: { contains: query, mode: "insensitive" }
		},
		include: {
			author: {
				select: {
					id: true,
					username: true,
					displayName: true,
					avatarUrl: true
				}
			}
		},
		orderBy: { createdAt: "desc" },
		take: limit,
		skip: skip
	});
}

export async function searchHashtags(query: string, limit: number, skip: number) {
	const searchTerm = query.startsWith("#") ? query : `#${query}`;
	
	const posts = await prisma.post.findMany({
		where: {
			deletedAt: null,
			visibility: "PUBLIC",
			textContent: { contains: searchTerm, mode: "insensitive" }
		},
		select: { textContent: true }
	});

	const hashtagCounts = new Map<string, number>();
	const regex = new RegExp(`(${searchTerm}\\w*)`, "gi");

	for (const post of posts) {
		if (!post.textContent) continue;
		const matches = post.textContent.match(regex);
		if (matches) {
			for (const match of matches) {
				const lowerMatch = match.toLowerCase();
				hashtagCounts.set(lowerMatch, (hashtagCounts.get(lowerMatch) || 0) + 1);
			}
		}
	}

	const result = Array.from(hashtagCounts.entries()).map(([hashtag, postCount]) => ({
		hashtag,
		postCount
	}));

	result.sort((a, b) => b.postCount - a.postCount);

	return result.slice(skip, skip + limit);
}
