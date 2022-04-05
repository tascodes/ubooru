<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let checked: boolean;
	export let tagName: string;

	const dispatch = createEventDispatcher();

	const onChange = () => {
		dispatch('change', { tagName, checked: !checked });
	};
</script>

<div class="inline-block mr-4 mt-4">
	<input
		on:change={onChange}
		bind:checked
		id={tagName}
		name={tagName}
		class="tag-checkbox opacity-0 absolute invisible"
		type="checkbox"
	/>
	<label
		for={tagName}
		class="select-none inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
	>
		{tagName}
	</label>
</div>

<style>
	input[type='checkbox'] + label {
		background-color: white; /* bg-white */
		color: #374151; /* text-gray-700 */
	}

	input[type='checkbox']:checked + label {
		background-color: #4338ca; /* bg-indigo-700 */
		color: white; /* text-white */
	}
</style>
