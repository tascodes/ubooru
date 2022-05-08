import trpcClient from '$lib/client/trpc';
import type { Post } from '@prisma/client';
import { queue } from 'async';

export interface PostToUpload {
	id: number;
	file: File;
	preview: string;
	title?: string;
	tags: {
		presets: {
			[key: string]: boolean;
		};
		character: string;
		species: string;
		other: string;
	};
	status: UploadStatus;
}

export enum UploadStatus {
	PENDING = 'PENDING',
	UPLOADING = 'UPLOADING',
	UPLOADED = 'UPLOADED',
	FAILED = 'FAILED'
}

const uploadImage = async ({ post }: { post: PostToUpload }) => {
	const { uploadURL, id } = await trpcClient.query('images.upload');

	const formData = new FormData();
	formData.append('file', post.file);

	await fetch(uploadURL, {
		method: 'POST',
		body: formData,
		mode: 'no-cors'
	});

	const presetTags = Object.entries(post.tags.presets)
		.filter(([, value]) => !!value)
		.map(([key]) => key);
	const customTags = [
		...post.tags.character.trim().split(/\s+/g),
		...post.tags.species.trim().split(/\s+/g),
		...post.tags.other.trim().split(/\s+/g)
	];

	const tags = [...new Set([...presetTags, ...customTags])];

	return trpcClient.mutation('images.publish', { title: post.title, imageId: id, tags });
};

export const uploadImages = async ({
	posts,
	concurrency = 5,
	starting,
	done,
	error,
	drain
}: {
	posts: PostToUpload[];
	concurrency?: number;
	starting?: (task: PostToUpload) => void;
	done?: (task: PostToUpload, post: Post) => void;
	error?: (task: PostToUpload, err: any) => void;
	drain?: () => void;
}) => {
	if (!posts.length) {
		return;
	}

	const q = queue(async (task: PostToUpload, errCallback) => {
		if (starting) {
			starting(task);
		}

		try {
			const post = await uploadImage({ post: task });

			if (done) {
				done(task, post);
			}
		} catch (e: any) {
			if (error) {
				error(task, e);
			}

			errCallback(e);
		}

		errCallback();
	}, concurrency);

	q.push(posts);

	await q.drain();

	if (drain) {
		drain();
	}
};

export default uploadImage;
