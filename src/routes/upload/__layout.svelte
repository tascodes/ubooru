<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async (session) => {
		if (!session.session.user) {
			return {
				status: 401,
				error: 'You must be logged in to do that.'
			};
		}
		return {};
	};
</script>

<slot />
