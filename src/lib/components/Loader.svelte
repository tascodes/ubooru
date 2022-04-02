<script lang="ts">
	import { fade } from 'svelte/transition';
	import { DoubleBounce } from 'svelte-loading-spinners';
</script>

<div
	transition:fade
	class="absolute h-full inset-0 bg-gray-500 bg-opacity-50 transition-opacity z-50"
	aria-hidden="true"
>
	<div class="relative flex items-center justify-center w-full h-full">
		<DoubleBounce color="#333333" />
	</div>
</div>
