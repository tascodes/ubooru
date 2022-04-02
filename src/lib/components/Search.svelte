<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let value = '';

	const dispatch = createEventDispatcher();

	const onKeyPress = (event: KeyboardEvent) => {
		const key = event.key;
		if (key === 'Enter') {
			dispatch('submit', value);
		}
	};

	const onButtonClick = () => {
		dispatch('submit', value);
	};
</script>

<div>
	<label for="search" class="block text-sm font-medium text-gray-700">Search posts</label>
	<div class="mt-1 relative flex items-center">
		<input
			on:keypress={onKeyPress}
			bind:value
			type="text"
			name="search"
			id="search"
			class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
		/>
		<button
			on:click={onButtonClick}
			aria-label="Search"
			type="button"
			class="ml-2 inline-flex items-center px-2 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>
	</div>
</div>
