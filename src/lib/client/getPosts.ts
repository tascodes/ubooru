import trpc from './trpc';

/**
 * Get a list of posts from a given tag-based search query
 *
 * @todo Add pagination and support for count property
 * @param query the tag query to search posts by
 * @returns a list of posts
 */
export const getPosts = async (query: string, page = 1, pageSize = 50, getCount = false) => {
	if (page < 1) {
		page = 1;
	}

	const offset = (page - 1) * pageSize;

	const response = await trpc.query('images.byTags', {
		tags: query,
		offset,
		limit: pageSize,
		count: getCount
	});

	return response;
};
