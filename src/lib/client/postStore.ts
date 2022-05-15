import { writable } from 'svelte/store';

interface PostStore {
	count?: number;
	tags?: string;
}

function createPostStore() {
	const store = writable<PostStore>({});
	const { subscribe, update } = store;

	const setCount = (count: number) => {
		update((value) => {
			return { ...value, count };
		});
	};

	const setTags = (tags: string) => {
		update((value) => {
			const count = tags === value.tags ? value.count : null;

			return { ...value, count, tags };
		});
	};

	return {
		subscribe,
		setCount,
		setTags
	};
}

export const postStore = createPostStore();
