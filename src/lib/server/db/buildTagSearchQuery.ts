import { Prisma } from '@prisma/client';
import type { ParseTagsResult } from '$lib/server/util/parseTags';

const MAX_COUNT_LIMIT = 12500;

export interface BuildTagSearchQueryOptions {
	tags: ParseTagsResult;
	limit: number;
	cursor?: number | undefined | null;
	offset?: number;
	count?: boolean;
}

// Generate a filter for the cursor
const cursorFilter = (cursor: number) => {
	return Prisma.sql`AND p.id >= ${cursor}`;
};

// Filter query for tags to exclude from the search results
const notTagFilter = (notTags: string[]) => {
	if (!notTags.length) {
		return Prisma.sql``;
	}

	return Prisma.sql`
  AND p.id NOT IN (
    SELECT p.id 
    FROM "Post" p, "TagsOnPosts" tp, "Tag" t 
    WHERE p.id = tp."postId" AND tp."tagId" = t.id 
    AND t.name IN (${Prisma.join(notTags)}))`;
};

const andTagFilter = (andTags: string[]) => {
	if (!andTags.length) {
		return Prisma.sql``;
	}
	return Prisma.sql`AND (t.name IN (${Prisma.join(andTags)}))`;
};

const andTagHavingCount = (andTags: string[]) => {
	if (!andTags.length) {
		return Prisma.sql``;
	}

	return Prisma.sql`HAVING COUNT( p.id ) = ${andTags.length}`;
};

const offsetStatement = (offset: number) => {
	if (offset < 1) {
		return Prisma.sql``;
	}

	return Prisma.sql`OFFSET ${offset}`;
};

// Sorting query to order the posts by id ascending or descending.
// Defaults to descending, newest posts first.
const getOrderBy = (sort: string) => {
	switch (sort) {
		case 'sort:id':
			return Prisma.sql`ORDER BY p.id ASC`;
		case 'sort:id_desc':
			return Prisma.sql`ORDER BY p.id DESC`;
		default:
			return Prisma.sql`ORDER BY p.id DESC`;
	}
};

// Search for posts without a count included
const searchPostsNoCount = ({
	cursor,
	and,
	not,
	offset,
	limit,
	sort
}: {
	cursor?: number;
	and?: string[];
	not?: string[];
	offset?: number;
	limit: number;
	sort: string;
}) => {
	const query = Prisma.sql`
    SELECT p. *
    ${
			and?.length || not?.length
				? Prisma.sql`
					FROM "Post" p, "TagsOnPosts" tp, "Tag" t
					WHERE p.id = tp."postId"
					AND tp."tagId" = t.id
				`
				: Prisma.sql`
					FROM "Post" p
				`
		}
    ${cursor ? cursorFilter(cursor) : Prisma.sql``}
    ${
			and?.length ? andTagFilter(and) : Prisma.sql`` // Include all posts with the "and" tags, if there are "and" tags
		}
    ${
			not?.length ? notTagFilter(not) : Prisma.sql`` // Remove any posts with the "not" tags present, if there are "not" tags
		}
    GROUP BY p.id
    ${and?.length ? andTagHavingCount(and) : Prisma.sql``}
    ${getOrderBy(sort)}
    ${offset && !cursor ? offsetStatement(offset) : Prisma.sql``}
    LIMIT ${limit}
  `;

	return query;
};

const searchPostsWithCount = ({
	cursor,
	and,
	not,
	offset,
	limit,
	sort
}: {
	cursor?: number;
	and?: string[];
	not?: string[];
	offset?: number;
	limit: number;
	sort: string;
}) => {
	return Prisma.sql`
    SELECT m. *, COUNT(m.id) OVER() as total_rows
    FROM (
      SELECT p. *
			${
				and?.length || not?.length
					? Prisma.sql`
						FROM "Post" p, "TagsOnPosts" tp, "Tag" t
						WHERE p.id = tp."postId"
    				AND tp."tagId" = t.id
					`
					: Prisma.sql`
						FROM "Post" p
					`
			}
      WHERE p.id = tp."postId"
    	AND tp."tagId" = t.id
      ${cursor ? cursorFilter(cursor) : Prisma.sql``}
      ${
				and?.length ? andTagFilter(and) : Prisma.sql`` // Include all posts with the "and" tags, if there are "and" tags
			}
      ${
				not?.length ? notTagFilter(not) : Prisma.sql`` // Remove any posts with the "not" tags present, if there are "not" tags
			}
      GROUP BY p.id
      ${and?.length ? andTagHavingCount(and) : Prisma.sql``}
      ${getOrderBy(sort)}
      ${offset && !cursor ? offsetStatement(offset) : Prisma.sql``}
      LIMIT ${MAX_COUNT_LIMIT}
    ) m
    LIMIT ${limit}
  `;
};

export const buildTagSearchQuery = (opts: BuildTagSearchQueryOptions): Prisma.Sql => {
	const count = opts.count || false;
	const { tags, limit, cursor, offset } = opts;
	const { and, not, sort } = tags;

	const args = {
		cursor: cursor || undefined,
		and,
		not,
		offset,
		limit,
		sort
	};

	if (!count) {
		return searchPostsNoCount({
			...args
		});
	} else {
		return searchPostsWithCount({
			...args
		});
	}
};
