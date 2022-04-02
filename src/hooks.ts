import { createContext, router } from '$lib/server/trpc';
import { createTRPCHandle } from 'trpc-sveltekit';

export const handle = createTRPCHandle({ url: '/trpc', router, createContext });

export async function handleError({ error }) {
	// example integration with https://sentry.io/
	console.error(error);
}
