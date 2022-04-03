import * as jwt from 'jsonwebtoken';

const JWT_SECRET = import.meta.env.VITE_JWT_SECRET;

export const verifyJWT = (token: string) => {
	if (!JWT_SECRET) {
		throw new Error('No JWT_SECRET');
	}

	let user: string | undefined;
	let exp: number | undefined;

	jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
		if (err || !decodedToken) {
			throw new Error('Failed to verify token.');
		}
		const token = decodedToken as jwt.JwtPayload;
		exp = token.exp;
		user = token.user;
	});

	return {
		user,
		exp
	};
};

export const createJWT = ({ userId, userName }: { userId: string; userName: string }) => {
	if (!JWT_SECRET) {
		throw new Error('No JWT_SECRET');
	}

	const exp = Math.round(Date.now() / 1000) + 86400;
	const token = jwt.sign({ exp, user: { name: userName, id: userId } }, JWT_SECRET, {
		algorithm: 'HS256'
	});
	return token;
};
