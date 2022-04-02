<script lang="ts">
	import { goto } from '$app/navigation';
	import Search from '$lib/components/Search.svelte';
	import { buildUrl } from '$lib/util/urlBuilder';

	const onSearch = async (event: CustomEvent<string>) => {
		const url = buildUrl('/posts', { queryParams: { tags: event.detail.trim() } });
		goto(url);
	};
</script>

<div class="flex-1 relative z-0 flex overflow-hidden min-h-screen">
	<div class="px-4 my-16">
		<Search on:submit={onSearch} />
	</div>
</div>
