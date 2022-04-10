<script lang="ts">
	import type { PostToUpload } from '$lib/client/uploadImage';
	import TagCheckbox from './TagCheckbox.svelte';
	import WideSlideover from './WideSlideover.svelte';

	const genderPresetTags = [
		'male',
		'female',
		'nonbinary',
		'transgender',
		'intersex',
		'ambiguous_gender'
	];

	const countPresetTags = ['solo', 'duo', 'group', 'zero_pictured'];

	const bodyTypePresetTags = ['anthro', 'feral', 'humanoid', 'human', 'taur'];

	export let selectedPost: PostToUpload | null;

	const onSlideoverClose = () => {
		if (!selectedPost) {
			return;
		}

		selectedPost.tags.character = selectedPost.tags.character.replace(/\s+/g, ' ').trim();
		selectedPost.tags.other = selectedPost.tags.other.replace(/\s+/g, ' ').trim();
		selectedPost.tags.species = selectedPost.tags.species.replace(/\s+/g, ' ').trim();

		selectedPost = null;
	};

	const onTagCheckboxChanged = (
		selectedPost: PostToUpload | null,
		{ tagName, checked }: { tagName: string; checked: boolean }
	) => {
		if (!selectedPost) {
			return;
		}

		selectedPost.tags.presets[tagName] = checked;
	};
</script>

<WideSlideover
	on:close={onSlideoverClose}
	open={!!selectedPost}
	title={selectedPost?.title || selectedPost?.file.name}
>
	{#if selectedPost}
		<div class="border border-solid drop-shadow-md border-gray-200 p-4 rounded max-h-min max-w-min">
			<img alt="" class="inline-block max-h-[24rem] max-w-[24rem]" src={selectedPost.preview} />
		</div>
		<form>
			<div>
				{#each genderPresetTags as tag}
					<TagCheckbox
						on:change={(event) => {
							onTagCheckboxChanged(selectedPost, event.detail);
						}}
						checked={!!selectedPost.tags.presets[tag]}
						tagName={tag}
					/>
				{/each}
			</div>

			<div>
				{#each countPresetTags as tag}
					<TagCheckbox
						on:change={(event) => {
							onTagCheckboxChanged(selectedPost, event.detail);
						}}
						checked={!!selectedPost.tags.presets[tag]}
						tagName={tag}
					/>
				{/each}
			</div>

			<div class="mt-4">
				<label for="tags" class="block text-sm font-medium text-gray-700">Character tags</label>
				<div class="mt-1">
					<textarea
						bind:value={selectedPost.tags.character}
						rows="4"
						name="tags"
						id="tags"
						placeholder="Examples: solo_focus character_name etc."
						class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
					/>
				</div>
			</div>

			<div>
				{#each bodyTypePresetTags as tag}
					<TagCheckbox
						on:change={(event) => {
							onTagCheckboxChanged(selectedPost, event.detail);
						}}
						checked={!!selectedPost.tags.presets[tag]}
						tagName={tag}
					/>
				{/each}
			</div>

			<div class="mt-4">
				<label for="tags" class="block text-sm font-medium text-gray-700">Species tags</label>
				<div class="mt-1">
					<textarea
						bind:value={selectedPost.tags.species}
						rows="4"
						name="tags"
						id="tags"
						placeholder="Examples: cat dragon wolf rat maned_wolf etc."
						class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
					/>
				</div>
			</div>

			<div class="mt-4">
				<label for="tags" class="block text-sm font-medium text-gray-700">Other tags</label>
				<div class="mt-1">
					<textarea
						bind:value={selectedPost.tags.other}
						rows="4"
						name="tags"
						id="tags"
						class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
					/>
				</div>
			</div>
		</form>
	{/if}
</WideSlideover>
