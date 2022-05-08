import Loader from '$lib/components/Loader.svelte';
import type { SvelteComponent } from 'svelte';

/**
 * Directive to display a loading spinner over the given element when some content is loading.
 *
 * @param node the node to display the loading spinner over
 * @param loading whether the content is loading
 * @returns a callback function executed by Svelte when the node is destroyed
 */
export const loader = (node: HTMLElement, loading: SvelteStore<boolean>) => {
	let spinner: SvelteComponent | null;
	const unsubscribe = loading.subscribe((loading) => {
		if (loading) {
			spinner = new Loader({
				target: node,
				intro: true
			});
		} else {
			if (spinner) {
				spinner?.$destroy?.();
			}
		}
	});
	return {
		destroy: () => {
			unsubscribe();
		}
	};
};
