import prisma from '$lib/server/prismaClient';
import type { Post } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { buildTagSearchQuery } from '../db/buildTagSearchQuery';
import { parseTags } from '../util/parseTags';
import { createRouter } from './context';

const CLOUDFLARE_IMAGES_API_TOKEN = import.meta.env.VITE_CLOUDFLARE_IMAGES_API_TOKEN;
const CLOUDFLARE_IMAGES_ACCOUNT_ID = import.meta.env.VITE_CLOUDFLARE_IMAGES_ACCOUNT_ID;

export default createRouter()
	.query('upload', {
		resolve: async ({ ctx }): Promise<{ id: string; uploadURL: string }> => {
			if (!ctx.user) {
				throw new TRPCError({ code: 'UNAUTHORIZED' });
			}

			const directUploadUrl = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_IMAGES_ACCOUNT_ID}/images/v2/direct_upload`;

			const response = await fetch(directUploadUrl, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${CLOUDFLARE_IMAGES_API_TOKEN}`
				}
			});
			const body = await response.json();

			return {
				id: body.result?.id,
				uploadURL: body.result?.uploadURL
			};
		}
	})
	.mutation('publish', {
		input: z.object({
			title: z.string().max(128).optional(),
			imageId: z.string(),
			tags: z.array(z.string()).optional()
		}),
		resolve: async ({ input, ctx }): Promise<Post> => {
			if (!ctx.user) {
				throw new TRPCError({ code: 'UNAUTHORIZED' });
			}

			const imageStatusUrl = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_IMAGES_ACCOUNT_ID}/images/v1/${input.imageId}`;

			const response = await fetch(imageStatusUrl, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${CLOUDFLARE_IMAGES_API_TOKEN}`,
					'Content-Type': 'application/json'
				}
			});
			let body;
			try {
				body = await response.json();
			} catch (e) {
				throw new TRPCError({
					message: `Failed to parse response from CloudFlare: ${await response.text()}`,
					code: 'INTERNAL_SERVER_ERROR'
				});
			}

			if (!body.result) {
				throw new TRPCError({
					message: 'Failed to check upload status.',
					code: 'INTERNAL_SERVER_ERROR'
				});
			}

			if (body.result.draft) {
				throw new TRPCError({
					message: 'Image must be uploaded first.',
					code: 'BAD_REQUEST'
				});
			} else {
				const imageUrls: string[] = body.result.variants;

				if (imageUrls.length === 0) {
					throw new TRPCError({
						message:
							'No image URLs generated. Is there a public variant set up in Cloudflare Images?',
						code: 'INTERNAL_SERVER_ERROR'
					});
				}

				const tags = input.tags?.map((tag) => tag.toLowerCase()) || [];

				return prisma.post.create({
					data: {
						title: input.title,
						imageId: input.imageId,
						tags: {
							create: tags.map((tagName) => {
								return {
									tag: {
										connectOrCreate: {
											where: { name: tagName },
											create: {
												name: tagName
											}
										}
									}
								};
							})
						}
					}
				});
			}
		}
	})
	.mutation('archive', {
		input: z.object({ id: z.number() }),
		resolve: async ({ input, ctx }) => {
			if (!ctx.user) {
				throw new TRPCError({ code: 'UNAUTHORIZED' });
			}

			return prisma.post.update({ where: { id: input.id }, data: { archived: true } });
		}
	})
	.query('byId', {
		input: z.object({ id: z.number() }),
		resolve: async ({ input, ctx }) => {
			if (ctx.user) {
				// Admin can see archived posts by ID.
				return prisma.post.findFirst({ where: { id: input.id } });
			}

			return prisma.post.findFirst({ where: { id: input.id, archived: false } });
		}
	})
	.query('byTags', {
		input: z.object({
			tags: z.string().optional(),
			cursor: z.number().optional(),
			offset: z.number().optional(),
			limit: z.number().min(1).max(150).default(50),
			count: z.boolean().default(false)
		}),
		resolve: async ({ input }) => {
			const limit = input.limit || 50;
			const tags = input.tags?.trim();
			const { cursor, count, offset } = input;

			const posts: any = await prisma.$queryRaw(
				buildTagSearchQuery({
					tags: parseTags(tags || ''),
					cursor: cursor,
					limit: limit,
					count,
					offset
				})
			);

			if (input.count) {
				const { total_rows } = posts && posts.length ? (posts[0] as any) : { total_rows: 0 };

				return {
					posts,
					count: count && total_rows
				};
			}

			return {
				posts
			};
		}
	});
