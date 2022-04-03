import images from './images';
import auth from './auth';
import type { Context } from './context';
import * as trpc from '@trpc/server';

export const router = trpc
	.router<Context>()
	.query('ping', {
		resolve: ({ ctx }) => {
			console.log(ctx.user);
			return 'pong';
		}
	})
	.merge('images.', images)
	.merge('auth.', auth);

export type Router = typeof router;
