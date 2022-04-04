import * as trpc from '@trpc/server';
import type { inferAsyncReturnType } from '@trpc/server';
import { getUserFromHeader } from '../util/auth';

export async function createContext(request: Request) {
	const user = await getUserFromHeader(request);

	return {
		user
	};
}
export type Context = inferAsyncReturnType<typeof createContext>;

export const createRouter = () => {
	return trpc.router<Context>();
};
