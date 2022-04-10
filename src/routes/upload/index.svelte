<script lang="ts">
	import { uploadImages, type PostToUpload } from '$lib/client/uploadImage';
	import TagCheckbox from '$lib/components/TagCheckbox.svelte';
	import TagSlideover from '$lib/components/TagSlideover.svelte';
	import WideSlideover from '$lib/components/WideSlideover.svelte';
	import { formatFileSize, removeFileExtension } from '$lib/util/formatters';
	import { trim } from 'lodash';
	import Dropzone from 'svelte-file-dropzone';

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

	// 20 MB maximum for Cloudflare
	const MAX_FILE_SIZE = 20 * 1000000;

	let posts: PostToUpload[] = [];
	let runningId = 0;
	let uploading = false;
	let selectedPost: PostToUpload | null = null;

	const onFilesSelect = (e: any) => {
		const { acceptedFiles } = e.detail;
		const addedPosts: PostToUpload[] = acceptedFiles
			.filter((file: File) => {
				return file.size <= MAX_FILE_SIZE;
			})
			.map((file: File) => ({
				id: runningId++,
				file,
				preview: URL.createObjectURL(file),
				title: removeFileExtension(file.name),
				tags: {
					presets: {},
					other: '',
					character: '',
					species: ''
				},
				status: 'idle'
			}));
		posts = [...posts, ...addedPosts];
	};

	const onRemoveFile = (e: any, index: number) => {
		posts.splice(index, 1);
		posts = posts;
	};

	const onRemoveAll = () => {
		posts = [];
	};

	const onClearAllTitles = () => {
		posts.forEach((_, idx) => {
			posts[idx].title = '';
		});
		posts = posts;
	};

	const upload = async () => {
		uploading = true;
		uploadImages({
			posts,
			starting: (task) => {
				const idx = posts.findIndex((post: PostToUpload) => {
					return post.id === task.id;
				});
				posts[idx].status = 'uploading';
				posts = posts;
			},
			done: (task, _post) => {
				const idx = posts.findIndex((p: PostToUpload) => {
					return p.id === task.id;
				});
				posts[idx].status = 'uploaded';
				posts = posts;
			},
			error: (task, error) => {
				console.error(error);
				const idx = posts.findIndex((p: PostToUpload) => {
					return p.id === task.id;
				});
				posts[idx].status = 'failed';
				posts = posts;
			},
			drain: () => {
				console.log('all uploaded');
			}
		});
	};

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

<Dropzone
	maxSize={MAX_FILE_SIZE}
	on:drop={onFilesSelect}
	accept={['image/*']}
	containerClasses="custom-dropzone"
>
	<button>Choose images to upload</button>

	<p>or</p>
	<p>Drag and drop them here</p>
</Dropzone>
<div class="mb-16">
	{#if posts?.length > 0}
		<div class="flex justify-between items-center w-full my-8">
			<div class="flex space-x-6 items-center">
				<button
					on:click={onRemoveAll}
					disabled={uploading}
					type="button"
					class="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-focus"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="-ml-0.5 mr-2 h-4 w-4"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
							clip-rule="evenodd"
						/>
					</svg>
					Remove all
				</button>

				<button
					on:click={onClearAllTitles}
					disabled={uploading}
					type="button"
					class="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-focus"
				>
					Clear all titles
				</button>
			</div>

			<button
				on:click={upload}
				disabled={uploading}
				type="button"
				class="inline-flex justify-self-end items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			>
				Upload
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="ml-3 -mr-1 h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		</div>
	{/if}

	<ul
		class="grid grid-cols-1 mx-12 gap-x-4 gap-y-8 sm:mx-0 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
	>
		{#each posts as item, index}
			<li class="relative">
				<div
					class="group block w-full aspect-w-7 aspect-h-7 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-focus overflow-hidden"
				>
					<img
						src={item.preview}
						alt=""
						class="object-contain p-4 pointer-events-none group-hover:opacity-75"
					/>
					<button
						on:click={() => {
							selectedPost = item;
						}}
						type="button"
						class="absolute inset-0 focus:outline-none"
					>
						<span class="sr-only">Edit tags for {item.title || item.file.name}</span>
					</button>
				</div>
				{#if !uploading}
					<button
						type="button"
						on:click={(e) => onRemoveFile(e, index)}
						class="absolute z-10 top-[-0.5rem] right-[-0.5rem] inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-focus"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>
				{/if}
				<div>
					<input
						type="text"
						name="title"
						placeholder="Title"
						class="mt-1 text-sm font-medium text-gray-900 focus:ring-focus-500 focus:border-focus block w-full sm:text-sm border-gray-300 rounded-md"
						disabled={uploading}
						bind:value={item.title}
					/>
				</div>

				<p class="block text-sm font-medium text-gray-500 pointer-events-none">
					{formatFileSize(item.file.size)}
				</p>
				<p class="block text-sm font-medium text-gray-500 pointer-events-none">
					{item.status}
				</p>
			</li>
		{/each}
	</ul>

	<TagSlideover bind:selectedPost />
</div>
