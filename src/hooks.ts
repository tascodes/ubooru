import { router } from '$lib/server/trpc';
import { createContext } from '$lib/server/trpc/context';
import { getUserFromHeader } from '$lib/server/util/auth';
import type { GetSession, Handle } from '@sveltejs/kit';
import { createTRPCHandle } from 'trpc-sveltekit';

export const handle: Handle = async (input) => {
	const user = await getUserFromHeader(input.event.request);

	if (user) {
		input.event.locals.user = user;
	}
	return createTRPCHandle({ url: '/trpc', router, createContext })(input);
};

export const getSession: GetSession = async (event) => {
	const { user } = event.locals;
	return {
		user
	};
};
