<script lang="ts">
	import trpc from '$lib/client/trpc';
	import { onMount } from 'svelte';

	let posts: any[] = [];

	const getPosts = async () => {
		const response = await trpc.query('images.byTags', {
			tags: '',
			limit: 150
		});
		posts = response.posts;
	};

	onMount(() => {
		getPosts();
	});
</script>

<a href="/upload">Upload Images</a>

<div class="my-16">
	<ul
		class="grid grid-cols-2 mx-12 gap-x-4 gap-y-8 sm:mx-0 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
	>
		{#each posts as post}
			<li class="relative">
				<div
					class="group block w-full aspect-w-7 aspect-h-7 rounded-lg focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-focus overflow-hidden"
				>
					<img
						src={post.thumbnailUrl || post.url}
						alt=""
						class="object-contain pointer-events-none group-hover:opacity-75"
					/>
					<button type="button" class="absolute inset-0 focus:outline-none">
						<span class="sr-only">View {post.title || 'Untitled'}</span>
					</button>
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
