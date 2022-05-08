import trpcClient from '$lib/client/trpc';
import type { Post } from '@prisma/client';
import { queue } from 'async';

/**
 * A single post to upload to the server
 */
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

/**
 * The status of a post that is being uploaded or will be uploaded
 */
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

/**
 * Arguments for uploadImages
 */
export interface UploadImagesConfig {
	/**
	 * The posts to upload
	 */
	posts: PostToUpload[];

	/**
	 * The maximum number of posts to upload at once during the upload process
	 */
	concurrency?: number;

	/**
	 * A function to call when a post starts uploading
	 */
	starting?: (task: PostToUpload) => void;

	/**
	 * A function to call when a post finishes uploading
	 */
	done?: (task: PostToUpload, post: Post) => void;

	/**
	 * A function to call when a post fails to upload
	 */
	error?: (task: PostToUpload, err: any) => void;

	/**
	 * A function to call when all posts have finished or failed to upload
	 */
	drain?: () => void;
}

/**
 * Upload multiple posts with a sliding-window technique.
 *
 * `concurrency` controls the maximum number of posts to upload at once.
 *
 * @param param0 the posts to upload, concurrency, and optional callbacks for each post upload processing event.
 */
export const uploadImages = async ({
	posts,
	concurrency = 5,
	starting,
	done,
	error,
	drain
}: UploadImagesConfig): Promise<void> => {
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
