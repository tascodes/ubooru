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
	import { getFull, getSample } from '$lib/util/cdn';

	export let post: Post;
	export let searchQuery = '';

	let sampleImage = getSample(post.imageId);
	let fullImage = getFull(post.imageId);

	let previewSize = 'Sample (850px)';
	$: postURL = previewSize === 'Sample (850px)' ? sampleImage : fullImage;

	const onSearch = async (event: CustomEvent<string>) => {
		const url = buildUrl('/posts', { queryParams: { tags: event.detail.trim() } });
		goto(url);
	};
</script>

<svelte:head>
	<meta content={post?.title || 'Untitled Post'} property="og:title" />
	<meta content="kobolds.moe" property="og:site_name" />
	{#if sampleImage}
		<meta content={sampleImage} property="og:image" />
	{/if}
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="flex-1 relative z-0 flex min-h-screen">
	<main class="flex-1 relative z-0 focus:outline-none xl:order-last">
		<div class="mb-16 mt-4 mx-4 max-h-full">
			<img
				class:fit-vertical={previewSize === 'Fit (Vertical)'}
				class:fit-horizontal={previewSize === 'Fit (Horizontal)'}
				class:full-size={previewSize === 'Original'}
				src={postURL}
				alt=""
			/>
			<div class="mt-6">
				{#if post.title && post.title.length}
					<p class="text-xl">{post.title}</p>
				{/if}
				<div class="max-w-[16rem] md:hidden">
					<label for="location" class="block text-sm font-medium text-gray-700">Preview</label>
					<select
						bind:value={previewSize}
						id="location"
						name="location"
						class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
					>
						<option>Original</option>
						<option>Sample (850px)</option>
						<option>Fit (Horizontal)</option>
						<option>Fit (Vertical)</option>
					</select>
				</div>
			</div>
		</div>
	</main>
	<aside
		class="hidden relative md:order-first md:flex md:flex-col flex-shrink-0 w-72 border-r border-gray-200 overflow-y-auto"
	>
		<div class="px-2 mt-16">
			<Search on:submit={onSearch} bind:value={searchQuery} />
		</div>
		<div class="px-2 mt-8">
			<label for="location" class="block text-sm font-medium text-gray-700">Preview</label>
			<select
				bind:value={previewSize}
				id="location"
				name="location"
				class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
			>
				<option>Original</option>
				<option>Sample (850px)</option>
				<option>Fit (Horizontal)</option>
				<option>Fit (Vertical)</option>
			</select>
		</div>
	</aside>
</div>

<style>
	.full-size {
		max-width: unset;
		max-height: unset;
	}

	.fit-vertical {
		max-width: unset;
		max-height: calc(100vh - 2rem);
		height: calc(100vh - 2rem);
	}

	.fit-horizontal {
		max-width: 100%;
		width: 100%;
		max-height: unset;
	}
</style>
