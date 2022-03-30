<script lang="ts">
	import trpc from '$lib/client/trpc';

	const getPosts = async () => {
		const posts = await trpc.query('images.byTags', {
			tags: ''
		});

		console.log(posts);
	};
</script>

<a href="/upload">Upload Images</a>

<button on:click={getPosts}>Click to get posts</button>
