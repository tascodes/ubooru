import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createRouter } from './context';
import prisma from '$lib/server/prismaClient';
import bcrypt from 'bcrypt';
import { createJWT } from '../util/auth';

export default createRouter()
	.mutation('login', {
		input: z.object({
			name: z.string(),
			password: z.string()
		}),
		resolve: async ({ input, ctx }) => {
			if (ctx.user) {
				throw new TRPCError({ message: 'Already logged in.', code: 'BAD_REQUEST' });
			}

			const user = await prisma.user.findFirst({ where: { name: input.name } });
			if (!user) {
				throw new TRPCError({
					message: 'User not found or invalid password.',
					code: 'UNAUTHORIZED'
				});
			}

			const token = await new Promise<string>((resolve) => {
				bcrypt.compare(input.password, user.password, (err, result) => {
					if (err) {
						throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
					}
					if (!result) {
						throw new TRPCError({
							message: 'User not found or invalid password.',
							code: 'UNAUTHORIZED'
						});
					}

					const token = createJWT({ userName: user.name, userId: user.id });

					resolve(token);
				});
			});

			return token;
		}
	})
	.mutation('register', {
		input: z.object({
			name: z.string(),
			password: z.string()
		}),
		resolve: async ({ input, ctx }) => {
			if (ctx.user) {
				throw new TRPCError({ message: 'Already logged in.', code: 'BAD_REQUEST' });
			}

			// There can only be 1 user on each ubooru instance by default.
			const existingUser = await prisma.user.findFirst();
			if (existingUser) {
				throw new TRPCError({
					message: 'Already registered.',
					code: 'UNAUTHORIZED'
				});
			}

			const user = await new Promise<{ id: string; name: string }>((resolve) => {
				bcrypt.hash(input.password, 10, async (err, hash) => {
					if (err) {
						throw new TRPCError({
							message: 'Failed to hash password',
							code: 'INTERNAL_SERVER_ERROR'
						});
					}
					const user = await prisma.user.create({
						select: {
							id: true,
							name: true
						},
						data: {
							name: input.name,
							password: hash
						}
					});

					resolve(user);
				});
			});

			return user;
		}
	});
