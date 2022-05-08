export interface BuildUrlOptions {
	queryParams: Record<string, any>;
}

/**
 * Construct a URL with query parameters and other options.
 *
 * @param baseUrl The URL to add query parameters to
 * @param opts Object containing the query parameters to attach to the URL
 * @returns a URL with query paramters
 */
export const buildUrl = (baseUrl: string, opts?: BuildUrlOptions): string => {
	let url = baseUrl;
	if (opts?.queryParams) {
		const params = new URLSearchParams(opts.queryParams);
		url = `${url}?${params}`;
	}

	return url;
};
