<script lang="ts" context="module">
	import type { ErrorLoad } from '@sveltejs/kit';

	export const load: ErrorLoad = ({ error, status }) => {
		return {
			props: {
				message: error?.message,
				status
			}
		};
	};
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';

	export let message: string;
	export let status: number;

	if (browser && status === 401) {
		goto('/login');
	}
</script>

<div>
	Error {status}
	{message ? ' - ' + message : ''}
</div>
