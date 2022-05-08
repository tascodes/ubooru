import { startCase } from 'lodash';

/**
 * Simplify a file's size into its largest representable unit.
 *
 * @param bytes size of the file in bytes
 * @param si whether to use SI units for data sizes
 * @param decimalPlaces the number of decimal places to display
 * @returns A reduced form notation of the file size in Kilobytes, Megabytes, etc.
 */
export function formatFileSize(bytes: number, si = true, decimalPlaces = 1) {
	const thresh = si ? 1000 : 1024;

	if (Math.abs(bytes) < thresh) {
		return bytes + ' B';
	}

	const units = si
		? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
		: ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
	let u = -1;
	const r = 10 ** decimalPlaces;

	do {
		bytes /= thresh;
		++u;
	} while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

	return bytes.toFixed(decimalPlaces) + ' ' + units[u];
}

export function removeFileExtension(filename: string) {
	return startCase(filename.substring(0, filename.lastIndexOf('.')) || filename);
}
