import trpc from './trpc';

export const getPosts = async (query: string) => {
	const response = await trpc.query('images.byTags', {
		tags: query
	});
	return response.posts;
};
