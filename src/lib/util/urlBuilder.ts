export interface BuildUrlOptions {
	queryParams: Record<string, any>;
}

export const buildUrl = (baseUrl: string, opts?: BuildUrlOptions) => {
	let url = baseUrl;
	if (opts?.queryParams) {
		const params = new URLSearchParams(opts.queryParams);
		url = `${url}?${params}`;
	}

	return url;
};
