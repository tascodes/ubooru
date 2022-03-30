import type { inferAsyncReturnType } from '@trpc/server';
import * as trpc from '@trpc/server';
import images from './images';

export const createContext = () => ({});

export const router = trpc
	.router<inferAsyncReturnType<typeof createContext>>()
	.query('ping', { resolve: () => 'ok' })
	.merge('images.', images);

export type Router = typeof router;
