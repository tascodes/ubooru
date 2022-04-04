import trpc from '$lib/client/trpc';
import type { RequestHandler } from '@sveltejs/kit';
import cookie from 'cookie';

export const post: RequestHandler = async ({ request }) => {
	const { name, password } = await request.json();
	if (!name || !password) {
		return {
			status: 400
		};
	}

	const token = await trpc.mutation('auth.login', { name, password });

	if (!token) {
		return {
			status: 401
		};
	}

	const tokenCookie = cookie.serialize('jwt', token, { httpOnly: true, maxAge: 86400 });

	return {
		status: 200,
		headers: {
			'set-cookie': tokenCookie
		}
	};
};
