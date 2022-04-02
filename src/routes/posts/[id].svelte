<script context="module" lang="ts">
	import trpc from '$lib/client/trpc';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ params, url }) => {
		let id: number;
		const q = url.searchParams.get('q');

		try {
			id = Number.parseInt(params.id, 10);
		} catch (e) {
			console.error(e);
			return {
				status: 400
			};
		}

		const post = await trpc.query('images.byId', {
			id
		});

		return {
			props: {
				post,
				searchQuery: q || ''
			}
		};
	};
</script>

<script lang="ts">
	import type { Post } from '@prisma/client';
	import Search from '$lib/components/Search.svelte';
	import { buildUrl } from '$lib/util/urlBuilder';
	import { goto } from '$app/navigation';

	export let post: Post;
	export let searchQuery = '';

	const onSearch = async (event: CustomEvent<string>) => {
		const url = buildUrl('/posts', { queryParams: { tags: event.detail.trim() } });
		goto(url);
	};
</script>

<div class="flex-1 relative z-0 flex overflow-hidden min-h-screen">
	<main class="flex-1 relative z-0 overflow-y-auto focus:outline-none xl:order-last">
		<div class="my-16 mx-4">
			<img src={post?.url} alt="" />
		</div>
	</main>
	<aside
		class="hidden relative md:order-first md:flex md:flex-col flex-shrink-0 w-72 border-r border-gray-200 overflow-y-auto"
	>
		<div class="px-4 my-16">
			<Search on:submit={onSearch} bind:value={searchQuery} />
		</div>
	</aside>
</div>
