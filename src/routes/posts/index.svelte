<script context="module" lang="ts">
	import type { Post } from '@prisma/client';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ url }) => {
		const tags = url.searchParams.get('tags');

		if (tags && tags.length) {
			const posts = await getPosts(tags);

			return {
				props: {
					posts,
					search: tags.trim()
				}
			};
		} else {
			const posts = await getPosts('');

			return {
				props: {
					posts,
					search: ''
				}
			};
		}
	};
</script>

<script lang="ts">
	import Image from '$lib/components/Image.svelte';
	import Search from '$lib/components/Search.svelte';
	import { getPosts } from '$lib/client/getPosts';
	import { goto } from '$app/navigation';
	import { buildUrl } from '$lib/util/urlBuilder';
	import { getThumbnail } from '$lib/util/cdn';

	export let posts: Post[];
	export let search = '';

	let searchQuery = search;

	const onSearch = async (event: CustomEvent<string>) => {
		const url = buildUrl('/posts', { queryParams: { tags: event.detail.trim() } });
		goto(url);
	};
</script>

<div class="flex-1 relative z-0 flex overflow-hidden min-h-screen">
	<main class="flex-1 relative z-0 overflow-y-auto focus:outline-none xl:order-last">
		<div class="my-16 mx-4">
			<ul
				class="relative grid grid-cols-2 mx-12 gap-x-4 gap-y-8 sm:mx-0 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
			>
				{#each posts as post, idx}
					<li class="relative">
						<div
							class="group block w-full aspect-w-7 aspect-h-7 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-focus overflow-hidden"
						>
							<Image
								src={getThumbnail(post.imageId)}
								alt=""
								parentClasses="object-contain pointer-events-none group-hover:opacity-75"
							/>
							<a
								href={buildUrl(`/posts/${post.id}`, { queryParams: { q: search } })}
								class="absolute inset-0 focus:outline-none"
							>
								<span class="sr-only">View {post.title || 'Untitled'}</span>
							</a>
						</div>
						{#if post.title?.length}
							<p class="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">
								{post.title}
							</p>
						{/if}
					</li>
				{/each}
			</ul>
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
