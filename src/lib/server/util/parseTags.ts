export interface ParseTagsResult {
	and: string[];
	not: string[];
	sort: string;
}

export const parseTags = (tagQuery: string): ParseTagsResult => {
	const splitTags = tagQuery
		.trim()
		.split(/ +/)
		.filter((tag) => tag.length > 0);

	const andTags: string[] = [];
	const notTags: string[] = [];
	let sort = 'sort:id_desc';

	splitTags.forEach((tag) => {
		// Add sort methods first
		if (tag.startsWith('sort:')) {
			sort = tag;
			return;
		}

		// Tags should not be on a post if they start with "-"
		if (tag.startsWith('-')) {
			notTags.push(tag.substring(1));
			return;
		}

		// Tags are "and" by default - all "and" tags should be on a selected post
		andTags.push(tag);
	});

	return {
		and: andTags,
		not: notTags,
		sort
	};
};
