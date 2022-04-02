<script lang="ts">
	import Waypoint from '$lib/components/Waypoint.svelte';

	export let src: string;
	export let alt: string;
	export let parentClasses = '';
</script>

<Waypoint throttle={500} offset={200}>
	<img {src} {alt} class={parentClasses} />
</Waypoint>
