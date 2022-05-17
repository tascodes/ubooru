<script context="module" lang="ts">
	import type { Post } from '@prisma/client';
	import type { Load } from '@sveltejs/kit';
	import { stringToInt } from '$lib/util/formatters';
	import _ from 'lodash';

	export const load: Load = async ({ url, session }) => {
		let tags = url.searchParams.get('tags');
		let page = url.searchParams.get('page');

		if (!tags) {
			tags = '';
		}
		tags = tags.trim();

		let pageNumber = 1;
		if (page?.length) {
			let pageOrNaN = stringToInt(page);
			pageNumber = isNaN(pageOrNaN) ? 1 : pageOrNaN;
		}

		postStore.setTags(tags);
		const storeVal = get(postStore);
		let postCount = storeVal.count;

		const { posts, count } = await getPosts(tags, pageNumber, 50, _.isNil(postCount));

		if (_.isNumber(count)) {
			postCount = count;
		}

		postStore.setCount(postCount || 0);

		return {
			props: {
				url,
				posts,
				page: pageNumber,
				search: tags,
				postCount,
				admin: !!session.user
			}
		};
	};
</script>

<script lang="ts">
	import Image from '$lib/components/Image.svelte';
	import Search from '$lib/components/Search.svelte';
	import { getPosts } from '$lib/client/getPosts';
	import { goto } from '$app/navigation';
	import { buildUrl } from '$lib/util/urlBuilder';
	import { getThumbnail } from '$lib/util/cdn';
	import PageSelect from '$lib/components/Pagination/PageSelect.svelte';
	import { postStore } from '$lib/client/postStore';
	import { get } from 'svelte/store';
	import trpc from '$lib/client/trpc';
	import Modal from '$lib/components/Modal.svelte';
	import Loader from '$lib/components/Loader.svelte';

	export let posts: Post[];
	export let search = '';
	export let page: number;
	export let postCount: number;
	export let url: URL;
	export let admin = false;

	let postToArchive: number | null = null;
	let searchQuery = search;
	let loading = false;

	const onSearch = async (event: CustomEvent<string>) => {
		const url = buildUrl('/posts', { queryParams: { tags: event.detail.trim() } });
		goto(url);
	};

	async function onPostArchiveClick(postId: number) {
		postToArchive = postId;
	}

	async function archivePost() {
		if (postToArchive === null) {
			return;
		}

		const post = postToArchive;

		// Clear the postToArchive to hide the modal
		postToArchive = null;

		loading = true;
		await trpc.mutation('images.archive', { id: post });
		await reloadPosts(true);
		loading = false;
	}

	async function reloadPosts(count = false) {
		const response = await getPosts(search, page, 50, count);
		posts = response.posts;
		if (response.count) {
			postCount = response.count;
		}
	}
</script>

<div class="flex-1 relative z-0 flex overflow-hidden min-h-screen">
	<main class="flex-1 relative z-0 overflow-y-auto focus:outline-none xl:order-last">
		{#if loading}
			<Loader />
		{/if}

		<PageSelect
			baseUrl="/posts"
			urlSearchParams={url.searchParams}
			bottom={false}
			totalCount={postCount}
			pageNumber={page}
			pageSize={50}
		/>

		<div class="my-16 mx-4">
			<ul
				class="relative grid grid-cols-2 mx-12 gap-x-4 gap-y-8 sm:mx-0 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8"
			>
				{#each posts as post}
					<li class="flex flex-col justify-between">
						<div>
							<div
								class="relative group w-full aspect-w-7 aspect-h-7 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-focus overflow-hidden"
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
								<p class="mt-2 block text-sm font-bold text-gray-900 truncate pointer-events-none">
									{post.title}
								</p>
							{/if}
						</div>

						{#if admin}
							<div class="border p-1.5 border-gray-300 rounded mt-4 mb-8">
								<button
									on:click={() => {
										onPostArchiveClick(post.id);
									}}
									type="button"
									aria-label="Archive post"
									class="mr-2 inline-flex items-center px-1.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-400 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-focus"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5 text-white"
										viewBox="0 0 20 20"
										fill="currentcolor"
									>
										<path
											fill-rule="evenodd"
											d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
											clip-rule="evenodd"
										/>
									</svg>
								</button>

								<button
									type="button"
									aria-label="Edit tags"
									class="mr-2 inline-flex items-center px-1.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-sky-400 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-focus"
									><svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5 text-white"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"
										/>
										<path
											fill-rule="evenodd"
											d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
											clip-rule="evenodd"
										/>
									</svg></button
								>
							</div>
						{/if}
					</li>
				{/each}
			</ul>

			<!-- Empty state -->
			{#if !posts?.length}
				<div class="text-center">Sorry, no posts here!</div>
			{/if}
		</div>

		<PageSelect
			baseUrl="/posts"
			urlSearchParams={url.searchParams}
			bottom={true}
			totalCount={postCount}
			pageNumber={page}
			pageSize={50}
		/>
	</main>
	<aside
		class="hidden relative md:order-first md:flex md:flex-col flex-shrink-0 w-72 border-r border-gray-200 overflow-y-auto"
	>
		<div class="px-4 my-16">
			<Search on:submit={onSearch} bind:value={searchQuery} />
		</div>
	</aside>

	<Modal
		open={postToArchive !== null}
		actionMessage="Archive post"
		title={`Archive post?`}
		bodyMessage="The post will be archived and hidden but not permanently deleted."
		on:action={archivePost}
		on:cancel={() => {
			postToArchive = null;
		}}
	/>
</div>
