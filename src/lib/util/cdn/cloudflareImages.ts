import config from '$lib/ubooru.config';

const getBaseUrl = () => {
	let baseUrl = config?.cloudflare?.imagesBaseUrl;
	if (!baseUrl) {
		throw new Error('No cloudflare imagesBaseUrl. Please configure in ubooru.config.cjs');
	}
	if (baseUrl.endsWith('/')) {
		baseUrl = baseUrl.slice(0, baseUrl.length - 1);
	}
	return baseUrl;
};

export const getThumbnail = (id: string) => {
	const baseUrl = getBaseUrl();

	const thumbnailVariant =
		config?.cloudflare?.variants?.thumbnail ||
		config?.cloudflare?.variants?.sample ||
		config?.cloudflare?.variants?.full ||
		'public';

	return `${baseUrl}/${id}/${thumbnailVariant}`;
};

export const getFull = (id: string) => {
	const baseUrl = getBaseUrl();

	const fullVariant =
		config?.cloudflare?.variants?.full ||
		config?.cloudflare?.variants?.sample ||
		config?.cloudflare?.variants?.thumbnail ||
		'public';

	return `${baseUrl}/${id}/${fullVariant}`;
};

export const getSample = (id: string) => {
	const baseUrl = getBaseUrl();

	const sampleVariant =
		config?.cloudflare?.variants?.sample ||
		config?.cloudflare?.variants?.full ||
		config?.cloudflare?.variants?.thumbnail ||
		'public';

	return `${baseUrl}/${id}/${sampleVariant}`;
};
