import * as trpc from '@trpc/server';
import type { inferAsyncReturnType } from '@trpc/server';
import { verifyJWT } from '../util/auth';

export async function createContext(request: Request) {
	async function getUserFromHeader() {
		const authorizationHeader = request.headers.get('authorization');
		if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
			try {
				const { user } = verifyJWT(authorizationHeader.split(' ')[1]);
				return user;
			} catch (e) {
				return null;
			}
		}

		return null;
	}
	const user = await getUserFromHeader();

	return {
		user
	};
}
export type Context = inferAsyncReturnType<typeof createContext>;

export const createRouter = () => {
	return trpc.router<Context>();
};
