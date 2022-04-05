import trpcClient from '$lib/client/trpc';
import type { Post } from '@prisma/client';
import { queue } from 'async';

export interface PostToUpload {
	id: number;
	file: File;
	preview: string;
	title?: string;
	tags: {
		[key: string]: boolean;
	};
	status: string;
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

	return trpcClient.mutation('images.publish', { title: post.title, imageId: id });
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
