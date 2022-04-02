import Loader from '$lib/components/Loader.svelte';
import type { SvelteComponent } from 'svelte';

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
