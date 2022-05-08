/**
 * Edit-Me: Edit this object, adding your custom image provider information.
 */
export default {
	cloudflare: {
		/**
		 * The base URL for cloudflare-hosted images. By default this is `https://imagedelivery.net/{your cloudflare user id}`
		 */
		imagesBaseUrl: 'https://imagedelivery.net/R6wzA5Dnx3ftIbCRXX7zgw',

		/**
		 * A list of variants configured in cloudflare
		 */
		variants: {
			/**
			 * The image variant used for thumbnails in your gallery.
			 *
			 * Recommended max width and max height of 320px
			 */
			thumbnail: 'thumbnail',

			/**
			 * The image variant used for the preview of an individual post.
			 *
			 * Recommended max width of 850px and height of 99999px
			 */
			sample: 'sample',

			/**
			 * The highest-res available view of the image.
			 *
			 * Recommended max width and max height of 99999px
			 */
			full: 'public'
		}
	}
};
